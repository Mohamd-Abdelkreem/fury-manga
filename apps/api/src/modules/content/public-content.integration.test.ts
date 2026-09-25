import { createDatabaseClient } from "@fury/database";
import { randomUUID } from "node:crypto";
import { afterAll, beforeEach, describe, expect, it } from "vitest";

import { NotFoundException } from "../../core/errors/not-found.error.js";
import type { PublicationStatus } from "@fury/contracts";
import { ChapterManagementService } from "./chapter-management.service.js";
import { PublicationManagementService } from "./publication-management.service.js";
import { PublicContentService } from "./public-content.service.js";
import { WorkManagementService } from "./work-management.service.js";

const databaseUrl = process.env["DATABASE_URL"];
if (databaseUrl === undefined) {
  throw new Error("The Testcontainers DATABASE_URL was not provided.");
}

const database = createDatabaseClient(databaseUrl);
const works = new WorkManagementService(database);
const chapters = new ChapterManagementService(database);
const publications = new PublicationManagementService(database, {
  currentTime: () => new Date(),
  createIdentifier: randomUUID,
});
const publicContent = new PublicContentService(database);
const pagination = { page: 1, limit: 25, skip: 0, take: 25 };

describe("PublicContentService with PostgreSQL", () => {
  beforeEach(async () => {
    await database.$executeRawUnsafe(
      "TRUNCATE media_reference_events, media_references, upload_attempts, media_assets, publication_events, chapter_pages, chapters, work_categories, categories, works",
    );
  });

  afterAll(async () => {
    await database.$disconnect();
  });

  it("returns only jointly eligible allowlisted metadata and hides it again", async () => {
    const work = await works.createWork({
      title: "Visible Work",
      slug: "visible-work",
      type: "manga",
      storyStatus: "ongoing",
    });
    const chapter = await chapters.createChapter(work.id, {
      number: 1,
      pages: [{ position: 1 }],
    });
    await expect(publicContent.listWorks(pagination)).resolves.toMatchObject({
      items: [],
      pagination: { total: 0 },
    });

    const publishedWork = await publications.publishWork(work.id, {
      expectedVersion: 0,
      targetState: "published",
    });
    await publications.publishChapter(work.id, chapter.id, {
      expectedVersion: 0,
      targetState: "published",
    });

    const visibleWork = await publicContent.getWork(work.slug);
    const visibleChapter = await publicContent.getChapter(work.slug, 1);
    expect(visibleWork).not.toHaveProperty("publicationStatus");
    expect(visibleWork).not.toHaveProperty("mediaReferences");
    expect(visibleWork).not.toHaveProperty("coverAssetId");
    expect(visibleChapter).not.toHaveProperty("pages");
    expect(visibleChapter).not.toHaveProperty("textContent");
    expect(visibleChapter).not.toHaveProperty("mediaReferences");

    await publications.publishWork(work.id, {
      expectedVersion: publishedWork.version,
      targetState: "draft",
    });
    await expect(publicContent.getWork(work.slug)).rejects.toBeInstanceOf(
      NotFoundException,
    );
    await expect(publicContent.getChapter(work.slug, 1)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it("returns truthful empty and overrun pagination", async () => {
    await expect(publicContent.listWorks(pagination)).resolves.toMatchObject({
      items: [],
      pagination: {
        page: 1,
        total: 0,
        totalPages: 0,
        hasNextPage: false,
      },
    });
    await expect(
      publicContent.listWorks({ page: 9, limit: 25, skip: 200, take: 25 }),
    ).resolves.toMatchObject({
      items: [],
      pagination: { page: 9, total: 0, totalPages: 0 },
    });
  });

  it("enforces every parent and Chapter visibility-state combination", async () => {
    const states = [
      "draft",
      "published",
      "archived",
    ] as const satisfies readonly PublicationStatus[];
    let publishedWorkCount = 0;

    for (const [workIndex, workState] of states.entries()) {
      for (const [chapterIndex, chapterState] of states.entries()) {
        const suffix = workState + "-" + chapterState;
        const work = await works.createWork({
          title: "Matrix " + suffix,
          slug: "matrix-" + suffix,
          type: "manga",
          storyStatus: "ongoing",
        });
        const chapter = await chapters.createChapter(work.id, {
          number: workIndex * states.length + chapterIndex + 1,
          pages: [{ position: 1 }],
        });
        if (workState !== "draft") {
          await publications.publishWork(work.id, {
            expectedVersion: 0,
            targetState: workState,
          });
        }
        if (chapterState !== "draft") {
          await publications.publishChapter(work.id, chapter.id, {
            expectedVersion: 0,
            targetState: chapterState,
          });
        }

        const workIsVisible = workState === "published";
        const chapterIsVisible = workIsVisible && chapterState === "published";
        if (workIsVisible) publishedWorkCount += 1;
        const workRead = publicContent.getWork(work.slug);
        if (workIsVisible) {
          await expect(workRead).resolves.toMatchObject({ id: work.id });
        } else {
          await expect(workRead).rejects.toBeInstanceOf(NotFoundException);
        }
        if (chapterIsVisible) {
          await expect(
            publicContent.listChapters(work.slug, pagination),
          ).resolves.toMatchObject({
            items: [{ id: chapter.id }],
            pagination: { total: 1 },
          });
          await expect(
            publicContent.getChapter(work.slug, chapter.number),
          ).resolves.toMatchObject({ id: chapter.id });
        } else if (workIsVisible) {
          await expect(
            publicContent.listChapters(work.slug, pagination),
          ).resolves.toMatchObject({
            items: [],
            pagination: { total: 0 },
          });
          await expect(
            publicContent.getChapter(work.slug, chapter.number),
          ).rejects.toBeInstanceOf(NotFoundException);
        } else {
          await expect(
            publicContent.listChapters(work.slug, pagination),
          ).rejects.toBeInstanceOf(NotFoundException);
          await expect(
            publicContent.getChapter(work.slug, chapter.number),
          ).rejects.toBeInstanceOf(NotFoundException);
        }
      }
    }

    await expect(publicContent.listWorks(pagination)).resolves.toMatchObject({
      pagination: { total: publishedWorkCount },
    });
  });
});
