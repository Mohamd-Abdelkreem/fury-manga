import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";

import { AUTH_SESSION_QUERY_KEY } from "@/features/auth/hooks/auth.hooks";
import {
  publicDetailFixture,
  publicNotFoundFixture,
  publicSuccessFixture,
} from "../api/public-catalog.test-helper";
import { imageBoundary, imageResponse } from "./public-image.test-helper";
import { PublicWorkDetails } from "./PublicWorkDetails";

vi.mock("next/navigation", () => ({
  usePathname: () => "/story/saved-work",
  useRouter: () => ({ refresh: vi.fn() }),
}));
const clients: QueryClient[] = [];
beforeEach(imageBoundary);
afterEach(() => {
  vi.unstubAllGlobals();
  for (const client of clients.splice(0)) client.clear();
});

it.each(["manga", "novel"] as const)(
  "retains the %s chapter search across an authoritative missing-chapter parent refresh",
  async (type) => {
    const detail = publicDetailFixture();
    detail.work.type = type;
    const requests: string[] = [];
    vi.stubGlobal("fetch", (request: Request) => {
      requests.push(request.url);
      if (request.url.endsWith("/cover"))
        return Promise.resolve(imageResponse());
      if (request.url.endsWith("/chapters/30"))
        return Promise.resolve(
          new Response(JSON.stringify(publicNotFoundFixture()), {
            status: 404,
          }),
        );
      return Promise.resolve(
        new Response(JSON.stringify(publicSuccessFixture(detail))),
      );
    });
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    clients.push(client);
    client.setQueryData(AUTH_SESSION_QUERY_KEY, null);
    render(
      <QueryClientProvider client={client}>
        <PublicWorkDetails
          slug="saved-work"
          seed={detail}
          serverRenderId="current"
        />
      </QueryClientProvider>,
    );
    fireEvent.change(await screen.findByLabelText("بحث عن فصل برقمه"), {
      target: { value: "30" },
    });

    expect(
      await screen.findByText("لم يتم العثور على فصل بهذا الرقم"),
    ).toBeVisible();
    expect(screen.getByLabelText("بحث عن فصل برقمه")).toHaveValue("30");
    expect(
      screen.getByRole("heading", { level: 1, name: "Saved Work" }),
    ).toBeVisible();
    await waitFor(() => {
      expect(
        requests.filter((url) => url.endsWith("/catalog/works/saved-work"))
          .length,
      ).toBeGreaterThanOrEqual(2);
    });
    expect(screen.queryByText(/فصل 1 —/)).not.toBeInTheDocument();
    expect(requests.filter((url) => url.endsWith("/chapters/30"))).toHaveLength(
      1,
    );
  },
);
