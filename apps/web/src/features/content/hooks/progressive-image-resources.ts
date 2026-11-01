import { SafeMediaError } from "@/features/media/api/media.api";
import { createMediaImageUrl } from "@/features/media/hooks/media-image-display";
import {
  PROGRESSIVE_IMAGE_BUDGET,
  progressiveImagePlan,
  webpFrameCount,
  type IllustratedPage,
  type ImageReadingMode,
} from "../model/progressive-images";

export type PageImageResource = Readonly<{
  phase: "loading" | "ready" | "error";
  url?: string;
  width: number;
  height: number;
  bytes: number;
  pixels: number;
  code?: string;
}>;
type ReadImage = (
  page: IllustratedPage,
  signal: AbortSignal,
) => Promise<Readonly<{ blob: Blob; width: number; height: number }>>;
const preparePageImage = async (
  image: Readonly<{ blob: Blob; width: number; height: number }>,
  policy: Readonly<{ reducedMotion: boolean }>,
  signal: AbortSignal,
) => {
  signal.throwIfAborted();
  const frames =
    image.blob.type === "image/webp"
      ? webpFrameCount(new Uint8Array(await image.blob.arrayBuffer()))
      : 1;
  const pixels =
    image.width * image.height * (policy.reducedMotion ? 1 : frames);
  if (pixels > PROGRESSIVE_IMAGE_BUDGET.decodedPixels)
    throw new SafeMediaError("MEDIA_LIMIT_EXCEEDED", 413, "");
  signal.throwIfAborted();
  const display = await createMediaImageUrl(
    image.blob,
    policy.reducedMotion,
    signal,
  );
  return {
    phase: "ready" as const,
    url: display.url,
    width: image.width,
    height: image.height,
    bytes: display.byteLength,
    pixels,
  };
};
type Cost = Readonly<{ bytes: number; pixels: number }>;
type Job = Readonly<{ controller: AbortController; epoch: number; cost: Cost }>;

/** One current viewer's private resources; no bytes survive its authority/lifecycle. */
export const createProgressiveImageResources = (
  pages: readonly IllustratedPage[],
  read: ReadImage,
  reducedMotion: boolean,
  initiallyConstrained: boolean,
) => {
  const resources = new Map<string, PageImageResource>();
  const estimates = new Map<string, Cost>();
  const jobs = new Map<string, Job>();
  const listeners = new Set<() => void>();
  let snapshot: ReadonlyMap<string, PageImageResource> = new Map();
  let current = 0;
  let mode: ImageReadingMode = "continuous";
  let constrained = initiallyConstrained;
  let epoch = 0;
  let running = false;
  let denialCode: string | undefined;
  let recovery: string | undefined;
  const encodedLimit = reducedMotion
    ? PROGRESSIVE_IMAGE_BUDGET.reducedMotionBytes
    : PROGRESSIVE_IMAGE_BUDGET.encodedBytes;

  const publish = () => {
    snapshot = new Map(resources);
    for (const listener of listeners) listener();
  };
  const release = (id: string) => {
    const entry = resources.get(id);
    if (entry?.url !== undefined) URL.revokeObjectURL(entry.url);
    resources.delete(id);
  };
  const priorities = () => {
    const plan = progressiveImagePlan(pages.length, current, mode, constrained);
    const desired = new Map<string, IllustratedPage>();
    for (const index of plan.priority) {
      const page = pages[index];
      if (page !== undefined && !desired.has(page.assetId))
        desired.set(page.assetId, page);
    }
    return { plan, desired };
  };
  const costFor = (page: IllustratedPage): Cost =>
    estimates.get(page.assetId) ?? {
      bytes: page.byteLength ?? PROGRESSIVE_IMAGE_BUDGET.maximumSourceBytes,
      pixels: (page.width ?? 720) * (page.height ?? 1024),
    };
  const fits = (cost: Cost) => {
    let bytes = cost.bytes,
      pixels = cost.pixels,
      count = 1;
    for (const resource of resources.values())
      if (resource.phase === "ready") {
        bytes += resource.bytes;
        pixels += resource.pixels;
        count++;
      }
    for (const job of jobs.values()) {
      bytes += job.cost.bytes;
      pixels += job.cost.pixels;
    }
    return (
      bytes <= encodedLimit &&
      pixels <= PROGRESSIVE_IMAGE_BUDGET.decodedPixels &&
      count <= PROGRESSIVE_IMAGE_BUDGET.retainedImages
    );
  };
  const makeRoom = (
    id: string,
    cost: Cost,
    desired: Map<string, IllustratedPage>,
  ) => {
    const ranking = [...desired.keys()];
    const rank = ranking.indexOf(id);
    for (const candidate of ranking.toReversed()) {
      if (fits(cost)) break;
      if (
        ranking.indexOf(candidate) > rank &&
        resources.get(candidate)?.phase === "ready"
      )
        release(candidate);
    }
    return fits(cost);
  };
  const deny = (id: string, code: string, page: IllustratedPage) => {
    epoch++;
    denialCode = code;
    recovery = undefined;
    estimates.clear();
    for (const job of jobs.values()) job.controller.abort();
    for (const key of [...resources.keys()]) release(key);
    resources.set(id, {
      phase: "error",
      width: page.width ?? 720,
      height: page.height ?? 1024,
      bytes: 0,
      pixels: 0,
      code,
    });
  };

  const isCurrentJob = (id: string, job: Job) =>
    running &&
    job.epoch === epoch &&
    !job.controller.signal.aborted &&
    jobs.get(id) === job;
  const acceptImage = (
    id: string,
    job: Job,
    image: Awaited<ReturnType<typeof preparePageImage>>,
  ) => {
    if (!isCurrentJob(id, job)) {
      URL.revokeObjectURL(image.url);
      return;
    }
    const actual = { bytes: image.bytes, pixels: image.pixels };
    estimates.set(id, actual);
    jobs.delete(id);
    resources.delete(id);
    const { desired } = priorities();
    if (!desired.has(id) || !makeRoom(id, actual, desired)) {
      URL.revokeObjectURL(image.url);
      return;
    }
    resources.set(id, image);
    if (recovery === id) {
      denialCode = undefined;
      recovery = undefined;
    }
  };
  const failImage = (page: IllustratedPage, job: Job, error: unknown) => {
    if (!isCurrentJob(page.assetId, job)) return;
    const code =
      error instanceof SafeMediaError ? error.code : "MEDIA_UNAVAILABLE";
    if (
      error instanceof SafeMediaError &&
      (error.statusCode === 401 || error.statusCode === 403)
    )
      deny(page.assetId, code, page);
    else
      resources.set(page.assetId, {
        phase: "error",
        width: page.width ?? 720,
        height: page.height ?? 1024,
        bytes: 0,
        pixels: 0,
        code,
      });
  };
  const settleImage = (id: string, job: Job) => {
    if (jobs.get(id) === job) {
      jobs.delete(id);
      if (resources.get(id)?.phase === "loading") resources.delete(id);
    }
    if (running) {
      publish();
      pump();
    }
  };
  const start = (page: IllustratedPage, cost: Cost) => {
    const id = page.assetId;
    const job: Job = { controller: new AbortController(), epoch, cost };
    jobs.set(id, job);
    resources.set(id, {
      phase: "loading",
      width: page.width ?? 720,
      height: page.height ?? 1024,
      bytes: 0,
      pixels: 0,
    });
    publish();
    void read(page, job.controller.signal)
      .then((image) =>
        preparePageImage(image, { reducedMotion }, job.controller.signal),
      )
      .then((image) => {
        acceptImage(id, job, image);
      })
      .catch((error: unknown) => {
        failImage(page, job, error);
      })
      .finally(() => {
        settleImage(id, job);
      });
  };
  const cancelObsolete = (
    desired: Map<string, IllustratedPage>,
    visible: string,
  ) => {
    const visibleReady = resources.get(visible)?.phase === "ready";
    for (const [id, job] of jobs) {
      if (
        !desired.has(id) ||
        (!visibleReady && id !== visible && id !== recovery) ||
        (constrained && id !== visible && id !== recovery && jobs.size > 1)
      )
        job.controller.abort();
    }
    for (const id of [...resources.keys()])
      if (!desired.has(id) && !jobs.has(id)) release(id);
  };
  const startEligible = (
    desired: Map<string, IllustratedPage>,
    visible: string,
    capacity: number,
  ) => {
    if (jobs.size >= capacity) return;
    const visibleReady = resources.get(visible)?.phase === "ready";
    for (const [id, page] of desired) {
      if (denialCode !== undefined && id !== recovery) continue;
      if (!visibleReady && id !== visible && id !== recovery) continue;
      if (jobs.has(id) || resources.has(id)) continue;
      const cost = costFor(page);
      if (makeRoom(id, cost, desired)) start(page, cost);
      if (jobs.size >= capacity) break;
    }
  };
  const showDenial = (page: IllustratedPage, code: string) => {
    for (const job of jobs.values()) job.controller.abort();
    for (const id of [...resources.keys()]) release(id);
    resources.set(page.assetId, {
      phase: "error",
      width: page.width ?? 720,
      height: page.height ?? 1024,
      bytes: 0,
      pixels: 0,
      code,
    });
    publish();
  };
  const pump = () => {
    if (!running) return;
    const { desired, plan } = priorities();
    const page = pages[plan.current];
    if (page === undefined) return;
    if (recovery !== undefined && !desired.has(recovery)) recovery = undefined;
    if (denialCode !== undefined && recovery === undefined) {
      showDenial(page, denialCode);
      return;
    }
    cancelObsolete(desired, page.assetId);
    startEligible(desired, page.assetId, plan.concurrency);
    publish();
  };

  return {
    getSnapshot: () => snapshot,
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    activate: () => {
      running = true;
      pump();
    },
    setPosition: (index: number, nextMode: ImageReadingMode) => {
      current = index;
      mode = nextMode;
      pump();
    },
    setConstrained: (value: boolean) => {
      constrained = value;
      pump();
    },
    retry: (id: string) => {
      if (!running || jobs.has(id)) return;
      release(id);
      if (denialCode !== undefined) recovery = id;
      pump();
    },
    failedDisplay: (id: string, url: string) => {
      const previous = resources.get(id);
      if (previous?.url !== url) return;
      release(id);
      resources.set(id, {
        phase: "error",
        width: previous.width,
        height: previous.height,
        bytes: 0,
        pixels: 0,
        code: "MEDIA_UNAVAILABLE",
      });
      publish();
    },
    dispose: () => {
      running = false;
      epoch++;
      for (const job of jobs.values()) job.controller.abort();
      for (const id of [...resources.keys()]) release(id);
      estimates.clear();
      publish();
    },
  };
};
