import { QueryClient } from "@tanstack/react-query";
import { act, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { publicCatalogKeys } from "../hooks/public-catalog.keys";
import { PublicWorkImage } from "./PublicWorkImage";
import {
  imageBoundary,
  imageResponse,
  queryWrapper,
} from "./public-image.test-helper";

const clients: QueryClient[] = [];
afterEach(() => {
  for (const client of clients.splice(0)) client.clear();
  vi.unstubAllGlobals();
});
describe("public image identity and Blob lifetime", () => {
  it.each(["other-work", "background"] as const)(
    "removes old decoded bytes while %s is pending",
    async (next) => {
      imageBoundary();
      vi.stubGlobal("fetch", (request: Request) =>
        request.url.endsWith("/first/cover")
          ? Promise.resolve(imageResponse())
          : new Promise(() => {}),
      );
      const revoke = vi.spyOn(URL, "revokeObjectURL");
      const client = new QueryClient();
      clients.push(client);
      const { rerender } = render(
        <PublicWorkImage slug="first" alt="First Work" />,
        { wrapper: queryWrapper(client) },
      );
      await waitFor(() =>
        expect(screen.getByRole("img")).toHaveAttribute(
          "src",
          "blob:synthetic-public-image",
        ),
      );
      rerender(
        <PublicWorkImage
          slug={next === "other-work" ? "second" : "first"}
          kind={next === "background" ? "background" : "cover"}
          alt="New identity"
        />,
      );
      expect(
        screen.getByRole("img", { name: "New identity" }),
      ).not.toHaveAttribute("src");
      expect(revoke).toHaveBeenCalledWith("blob:synthetic-public-image");
    },
  );
  it("clears the imperative src when the same resource cache is reset", async () => {
    imageBoundary();
    let ready = true;
    vi.stubGlobal("fetch", () =>
      ready ? Promise.resolve(imageResponse()) : new Promise(() => {}),
    );
    const client = new QueryClient();
    clients.push(client);
    render(<PublicWorkImage slug="first" alt="First Work" />, {
      wrapper: queryWrapper(client),
    });
    await waitFor(() =>
      expect(screen.getByRole("img")).toHaveAttribute(
        "src",
        "blob:synthetic-public-image",
      ),
    );
    ready = false;
    act(() => {
      void client.resetQueries({
        queryKey: publicCatalogKeys.image("first", "cover"),
        exact: true,
      });
    });
    await waitFor(() =>
      expect(screen.getByRole("img")).not.toHaveAttribute("src"),
    );
  });
  it("defers an off-screen card API read until it approaches the viewport", async () => {
    imageBoundary();
    let reveal: () => void = () => {
      throw new Error("Observer was not attached");
    };
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        constructor(
          callback: (entries: { isIntersecting: boolean }[]) => void,
        ) {
          reveal = () => {
            callback([{ isIntersecting: true }]);
          };
        }
        observe() {}
        disconnect() {}
      },
    );
    const request = vi.fn(() => Promise.resolve(imageResponse()));
    vi.stubGlobal("fetch", request);
    const client = new QueryClient();
    clients.push(client);
    render(<PublicWorkImage slug="off-screen" alt="Off-screen Work" />, {
      wrapper: queryWrapper(client),
    });
    expect(request).not.toHaveBeenCalled();
    act(() => {
      reveal();
    });
    await waitFor(() =>
      expect(screen.getByRole("img")).toHaveAttribute(
        "src",
        "blob:synthetic-public-image",
      ),
    );
    expect(request).toHaveBeenCalledTimes(1);
  });

  it("activates and recovers a cached error when a lazy card remounts into view", async () => {
    imageBoundary();
    vi.stubGlobal("fetch", () =>
      Promise.resolve(new Response("{}", { status: 503 })),
    );
    const client = new QueryClient();
    clients.push(client);
    const first = render(
      <PublicWorkImage slug="cached-failure" alt="Work" retryable={false} />,
      { wrapper: queryWrapper(client) },
    );
    await screen.findByText("تعذّر تحميل الصورة");
    first.unmount();
    let reveal: () => void = () => {
      throw new Error("Observer was not attached");
    };
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        constructor(
          callback: (entries: { isIntersecting: boolean }[]) => void,
        ) {
          reveal = () => {
            callback([{ isIntersecting: true }]);
          };
        }
        observe() {}
        disconnect() {}
      },
    );
    const fetch = vi.fn(() => Promise.resolve(imageResponse()));
    vi.stubGlobal("fetch", fetch);
    render(
      <PublicWorkImage slug="cached-failure" alt="Work" retryable={false} />,
      { wrapper: queryWrapper(client) },
    );
    expect(fetch).not.toHaveBeenCalled();
    act(() => {
      reveal();
    });
    await waitFor(() =>
      expect(screen.getByRole("img")).toHaveAttribute(
        "src",
        "blob:synthetic-public-image",
      ),
    );
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});
