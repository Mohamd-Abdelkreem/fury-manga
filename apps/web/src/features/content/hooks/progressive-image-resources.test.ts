import { waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SafeMediaError } from "@/features/media/api/media.api";
import { createProgressiveImageResources } from "./progressive-image-resources";

const pages = Array.from({ length: 30 }, (_, index) => ({
  assetId: `page-${String(index)}`,
  width: 600,
  height: 800,
  byteLength: 4,
}));
type ImageResult = { blob: Blob; width: number; height: number };
const image = (): ImageResult => ({
  blob: new Blob(["page"], { type: "image/png" }),
  width: 600,
  height: 800,
});
const owned: ReturnType<typeof createProgressiveImageResources>[] = [];
let live: Set<string>;
let sequence: number;

beforeEach(() => {
  live = new Set();
  sequence = 0;
  vi.spyOn(URL, "createObjectURL").mockImplementation(() => {
    const url = `blob:page-${String(sequence++)}`;
    live.add(url);
    return url;
  });
  vi.spyOn(URL, "revokeObjectURL").mockImplementation((url) => {
    live.delete(url);
  });
});
afterEach(() => {
  for (const owner of owned.splice(0)) owner.dispose();
  expect(live.size).toBe(0);
});

const harness = () => {
  const requested: string[] = [];
  const pending = new Map<
    string,
    {
      signal: AbortSignal;
      resolve: (value: ImageResult) => void;
      reject: (error: unknown) => void;
    }
  >();
  const owner = createProgressiveImageResources(
    pages,
    (page, signal) => {
      requested.push(page.assetId);
      return new Promise<ImageResult>((resolve, reject) => {
        pending.set(page.assetId, { signal, resolve, reject });
      });
    },
    false,
    false,
  );
  owned.push(owner);
  const finish = async (id: string) => {
    const request = pending.get(id);
    pending.delete(id);
    request?.resolve(image());
    await waitFor(() => {
      expect(owner.getSnapshot().get(id)?.phase).toBe("ready");
    });
  };
  return { owner, requested, pending, finish };
};

describe("private viewer resource ownership", () => {
  it("loads visible first, bounds background work, deduplicates observer events and extends before the boundary", async () => {
    const { owner, requested, pending, finish } = harness();
    owner.activate();
    expect(requested).toEqual(["page-0"]);
    await finish("page-0");
    expect(pending.size).toBe(2);
    for (let index = 1; index < 10; index++)
      await finish(`page-${String(index)}`);
    expect(requested).toHaveLength(10);
    for (let event = 0; event < 20; event++) owner.setPosition(0, "continuous");
    expect(requested).toHaveLength(10);
    owner.setPosition(4, "continuous");
    expect(requested.slice(-2)).toEqual(["page-10", "page-11"]);
    expect(requested).not.toContain("page-20");
  });

  it("keeps aborted slots occupied until settlement and gives a direct jump priority over obsolete background work", async () => {
    const { owner, requested, pending, finish } = harness();
    owner.activate();
    await finish("page-0");
    const obsolete = [...pending.values()];
    owner.setPosition(24, "continuous");
    expect(obsolete.every((request) => request.signal.aborted)).toBe(true);
    expect(requested).not.toContain("page-24");
    for (const request of obsolete) request.resolve(image());
    pending.clear();
    await waitFor(() => {
      expect(requested.at(-1)).toBe("page-24");
    });
    await finish("page-24");
    expect(owner.getSnapshot().has("page-0")).toBe(false);
    owner.setPosition(3, "single");
    expect(live.size).toBeLessThanOrEqual(5);
  });

  it("holds a confirmed denial across late responses until deliberate fresh retry", async () => {
    const { owner, pending, finish } = harness();
    owner.activate();
    await finish("page-0");
    const late = pending.get("page-2");
    pending
      .get("page-1")
      ?.reject(new SafeMediaError("FORBIDDEN", 403, "denied"));
    await waitFor(() => {
      expect(live.size).toBe(0);
    });
    late?.resolve(image());
    pending.clear();
    await waitFor(() => {
      expect(owner.getSnapshot().get("page-0")?.code).toBe("FORBIDDEN");
    });
    owner.setPosition(1, "continuous");
    expect(pending.size).toBe(0);
    owner.retry("page-1");
    await waitFor(() => {
      expect(pending.has("page-1")).toBe(true);
    });
    const interruptedRecovery = pending.get("page-1");
    owner.setPosition(24, "continuous");
    expect(interruptedRecovery?.signal.aborted).toBe(true);
    expect(owner.getSnapshot().get("page-24")?.code).toBe("FORBIDDEN");
    interruptedRecovery?.resolve(image());
    pending.clear();
    await waitFor(() => {
      expect(owner.getSnapshot().get("page-24")?.phase).toBe("error");
    });
    owner.retry("page-24");
    await waitFor(() => {
      expect(pending.has("page-24")).toBe(true);
    });
    await finish("page-24");
    expect(owner.getSnapshot().get("page-24")?.url).toBeDefined();
  });

  it("keeps individual failures retryable and ignores obsolete display errors", async () => {
    const { owner, pending, finish, requested } = harness();
    owner.activate();
    pending
      .get("page-0")
      ?.reject(new SafeMediaError("MEDIA_UNAVAILABLE", 503, "unavailable"));
    pending.clear();
    await waitFor(() => {
      expect(owner.getSnapshot().get("page-0")?.phase).toBe("error");
    });
    owner.retry("page-0");
    owner.retry("page-0");
    expect(requested).toEqual(["page-0", "page-0"]);
    await finish("page-0");
    const url = owner.getSnapshot().get("page-0")?.url;
    owner.failedDisplay("page-0", "blob:obsolete");
    expect(owner.getSnapshot().get("page-0")?.url).toBe(url);
    if (url === undefined) throw new Error("Missing ready image");
    owner.failedDisplay("page-0", url);
    expect(owner.getSnapshot().get("page-0")?.phase).toBe("error");
  });

  it.each([
    { budget: "decoded", width: 4000, height: 6000, bytes: 4, retained: 1 },
    {
      budget: "encoded",
      width: 600,
      height: 800,
      bytes: 12 * 1024 * 1024,
      retained: 2,
    },
  ])(
    "bounds $budget retention during constrained single-page navigation",
    async ({ width, height, bytes, retained }) => {
      let largest = 0;
      const owner = createProgressiveImageResources(
        pages.map((page) => ({ ...page, width, height, byteLength: bytes })),
        () =>
          Promise.resolve({
            blob: new Blob([new Uint8Array(bytes)], { type: "image/png" }),
            width,
            height,
          }),
        false,
        true,
      );
      owned.push(owner);
      owner.subscribe(() => {
        largest = Math.max(
          largest,
          [...owner.getSnapshot().values()].filter(
            (resource) => resource.phase === "ready",
          ).length,
        );
      });
      owner.activate();
      await waitFor(() => {
        expect(owner.getSnapshot().get("page-0")?.phase).toBe("ready");
      });
      owner.setPosition(20, "single");
      await waitFor(() => {
        expect(owner.getSnapshot().get("page-20")?.phase).toBe("ready");
      });
      expect(largest).toBeLessThanOrEqual(retained);
      expect(live.size).toBeLessThanOrEqual(retained);
    },
  );

  it("disposes late results without retaining URLs and can reactivate under Strict Mode", async () => {
    const { owner, pending } = harness();
    owner.activate();
    const late = pending.get("page-0");
    owner.dispose();
    owner.activate();
    expect(late?.signal.aborted).toBe(true);
    late?.resolve(image());
    pending.clear();
    await waitFor(() => {
      expect(pending.has("page-0")).toBe(true);
    });
    owner.dispose();
    pending.get("page-0")?.resolve(image());
    await waitFor(() => {
      expect(owner.getSnapshot().size).toBe(0);
    });
    expect(live.size).toBe(0);
  });
});
