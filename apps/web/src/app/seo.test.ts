// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  publicPageMetadata,
  publicWorkMetadata,
  unavailableWorkMetadata,
} from "@/features/public-catalog/api/public-catalog.seo";
import {
  publicDetailFixture,
  publicSuccessFixture,
} from "@/features/public-catalog/api/public-catalog.test-helper";
import { SafePublicCatalogError } from "@/features/public-catalog/model/public-catalog.errors";
import sitemap from "./sitemap";
import robots from "./robots";

vi.mock("server-only", () => ({}));
beforeEach(() => {
  vi.stubEnv("SITE_ORIGIN", "https://configured.example.test");
  vi.stubEnv("SERVER_API_URL", "http://private-api.example.test/api/v1");
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});
describe("public SEO output", () => {
  it("uses configured canonical origins and base canonical/noindex for query variants", () => {
    const metadata = publicPageMetadata("/discover", "اكتشف", "وصف عربي", true);
    expect(metadata.alternates?.canonical).toBe(
      "https://configured.example.test/discover",
    );
    expect(metadata.robots).toEqual({ index: false, follow: true });
    expect(publicPageMetadata("/stories", "قصص", "نصوص").robots).toEqual({
      index: true,
      follow: true,
    });
  });
  it("uses saved slug/title/synopsis and public direct cover in social output", () => {
    const detail = publicDetailFixture("canonical-slug");
    const metadata = publicWorkMetadata(detail);
    expect(metadata.title).toBe(detail.work.title);
    expect(metadata.description).toBe(detail.work.synopsis);
    expect(metadata.alternates?.canonical).toBe(
      "https://configured.example.test/story/canonical-slug",
    );
    expect(JSON.stringify(metadata.openGraph)).toContain(
      "/content/works/canonical-slug/cover",
    );
    expect(JSON.stringify(metadata)).not.toContain("private-api");
  });
  it("distinguishes confirmed absence from an upstream failure without social leakage", () => {
    const absent = unavailableWorkMetadata(
      new SafePublicCatalogError("NOT_FOUND", 404),
    );
    const failed = unavailableWorkMetadata(
      new SafePublicCatalogError("NETWORK_ERROR", 0),
    );
    expect(absent.title).toBe("العمل غير موجود");
    expect(failed.title).toBe("المحتوى غير متاح مؤقتًا");
    expect(absent.robots).toEqual({ index: false, follow: false });
    expect(absent.openGraph).toEqual({ images: [] });
  });
  it("exports only roots plus current eligible canonical works and refuses partial sitemap success", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation(() =>
        Promise.resolve(
          new Response(
            JSON.stringify(
              publicSuccessFixture({
                items: [{ slug: "first" }, { slug: "second" }],
              }),
            ),
          ),
        ),
      ),
    );
    const urls = (await sitemap()).map((item) => item.url);
    expect(urls).toEqual(
      [
        "/",
        "/discover",
        "/stories",
        "/categories",
        "/story/first",
        "/story/second",
      ].map((path) => new URL(path, "https://configured.example.test").href),
    );
    expect(new Set(urls).size).toBe(urls.length);
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response("{}", { status: 503 })),
    );
    await expect(sitemap()).rejects.toMatchObject({ statusCode: 503 });
    const policy = robots();
    expect(policy.sitemap).toBe("https://configured.example.test/sitemap.xml");
    expect(JSON.stringify(policy.rules)).toContain("/story/*/chapter/");
    expect(JSON.stringify(policy.rules)).toContain("/admin/");
  });
});
