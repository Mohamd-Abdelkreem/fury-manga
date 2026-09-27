import { randomUUID } from "node:crypto";

import { afterAll, beforeEach, describe, expect, it } from "vitest";

import { createDatabaseClient } from "@fury/database";

import { prepareWorkForPublication } from "../../test-support/content-publication-fixture.test-helper.js";
import { PublicationManagementService } from "./publication-management.service.js";
import { WorkManagementService } from "./work-management.service.js";

const databaseUrl = process.env["DATABASE_URL"];
if (databaseUrl === undefined)
  throw new Error("Testcontainers DATABASE_URL is required.");

const database = createDatabaseClient(databaseUrl);
const works = new WorkManagementService(database);
const publications = new PublicationManagementService(database, {
  createIdentifier: randomUUID,
  currentTime: () => new Date(),
});
const actorIds: string[] = [];

beforeEach(async () => {
  await database.$executeRawUnsafe(
    "TRUNCATE media_reference_events, media_references, upload_attempts, media_assets, publication_events, chapter_pages, chapters, work_tags, work_categories, categories, works",
  );
});

afterAll(async () => {
  await database.$executeRawUnsafe(
    "TRUNCATE media_reference_events, media_references, upload_attempts, media_assets, publication_events, chapter_pages, chapters, work_tags, work_categories, categories, works",
  );
  await database.user.deleteMany({ where: { id: { in: actorIds } } });
  await database.$disconnect();
});

describe("Work publication transactions", () => {
  for (const type of ["manga", "text-story"] as const) {
    it(`publishes, repeats, unpublishes, archives, restores and republishes ${type} without duplicate events`, async () => {
      const draft = await works.createWork({
        title: `Publication ${type}`,
        slug: `publication-${type}-${randomUUID()}`,
        type,
        storyStatus: "ongoing",
      });
      actorIds.push(await prepareWorkForPublication(database, draft.id));
      const first = await publications.publishWork(draft.id, {
        expectedVersion: draft.version,
        targetState: "published",
      });
      expect(first).toMatchObject({
        publicationStatus: "published",
        transitioned: true,
        version: draft.version + 1,
      });
      expect(first.publishedAt).not.toBeNull();
      expect(first.publicationEventId).not.toBeNull();
      expect(
        await database.publicationEvent.count({ where: { workId: draft.id } }),
      ).toBe(1);

      const repeated = await publications.publishWork(draft.id, {
        expectedVersion: draft.version,
        targetState: "published",
      });
      expect(repeated).toMatchObject({
        publicationStatus: "published",
        transitioned: false,
        version: first.version,
        publicationEventId: first.publicationEventId,
      });
      expect(
        await database.publicationEvent.count({ where: { workId: draft.id } }),
      ).toBe(1);

      const unpublished = await publications.publishWork(draft.id, {
        expectedVersion: first.version,
        targetState: "draft",
      });
      expect(unpublished).toMatchObject({
        publicationStatus: "draft",
        publishedAt: null,
        publicationEventId: null,
      });
      const archived = await publications.publishWork(draft.id, {
        expectedVersion: unpublished.version,
        targetState: "archived",
      });
      expect(archived.publicationStatus).toBe("archived");
      await expect(
        publications.publishWork(draft.id, {
          expectedVersion: archived.version,
          targetState: "published",
        }),
      ).rejects.toMatchObject({ code: "CONTENT_TRANSITION_CONFLICT" });
      expect(
        await database.publicationEvent.count({ where: { workId: draft.id } }),
      ).toBe(1);
      const restored = await publications.publishWork(draft.id, {
        expectedVersion: archived.version,
        targetState: "draft",
      });
      expect(restored).toMatchObject({
        publicationStatus: "draft",
        transitioned: true,
      });
      const republished = await publications.publishWork(draft.id, {
        expectedVersion: restored.version,
        targetState: "published",
      });
      expect(republished).toMatchObject({
        publicationStatus: "published",
        transitioned: true,
      });
      expect(republished.publicationEventId).not.toBe(first.publicationEventId);
      expect(
        await database.publicationEvent.count({ where: { workId: draft.id } }),
      ).toBe(2);
    });
  }
});

describe("Chapter publication transactions", () => {
  it("rejects incomplete Chapters without an event or version change", async () => {
    const work = await works.createWork({
      title: "Incomplete Chapter Work",
      slug: `chapter-incomplete-${randomUUID()}`,
      type: "manga",
      storyStatus: "ongoing",
    });
    const chapter = await database.chapter.create({
      data: {
        workId: work.id,
        number: 1,
        title: "Incomplete",
        contentType: "ILLUSTRATED",
      },
    });
    await expect(
      publications.publishChapter(work.id, chapter.id, {
        expectedVersion: 0,
        targetState: "published",
      }),
    ).rejects.toMatchObject({
      code: "CONTENT_NOT_READY",
      errors: [{ field: "body.pages" }],
    });
    expect(
      await database.chapter.findUniqueOrThrow({ where: { id: chapter.id } }),
    ).toMatchObject({
      publicationStatus: "DRAFT",
      version: 0,
    });
    expect(
      await database.publicationEvent.count({
        where: { chapterId: chapter.id },
      }),
    ).toBe(0);
  });

  it("uses authoritative identity for retries and a new event for a later republish", async () => {
    const work = await works.createWork({
      title: "Text Publication Work",
      slug: `chapter-publish-${randomUUID()}`,
      type: "text-story",
      storyStatus: "ongoing",
    });
    const chapter = await database.chapter.create({
      data: {
        workId: work.id,
        number: 1,
        title: "Ready text",
        contentType: "TEXT",
        textContent: {
          version: 1,
          blocks: [{ type: "paragraph", content: [{ text: "A story." }] }],
        },
      },
    });
    const command = { expectedVersion: 0, targetState: "published" as const };
    const [first, retry] = await Promise.all([
      publications.publishChapter(work.id, chapter.id, command),
      publications.publishChapter(work.id, chapter.id, command),
    ]);
    expect([first.transitioned, retry.transitioned].sort()).toEqual([
      false,
      true,
    ]);
    expect(first.publicationEventId).toBe(retry.publicationEventId);
    expect(
      await database.publicationEvent.count({
        where: { chapterId: chapter.id },
      }),
    ).toBe(1);
    await expect(
      publications.publishChapter(work.id, chapter.id, {
        expectedVersion: 0,
        targetState: "archived",
      }),
    ).rejects.toMatchObject({ code: "CONTENT_STALE_WRITE" });
    const draft = await publications.publishChapter(work.id, chapter.id, {
      expectedVersion: 1,
      targetState: "draft",
    });
    const republished = await publications.publishChapter(work.id, chapter.id, {
      expectedVersion: draft.version,
      targetState: "published",
    });
    expect(republished.publicationEventId).not.toBe(first.publicationEventId);
    expect(
      await database.publicationEvent.count({
        where: { chapterId: chapter.id },
      }),
    ).toBe(2);
    const archived = await publications.publishChapter(work.id, chapter.id, {
      expectedVersion: republished.version,
      targetState: "archived",
    });
    await expect(
      publications.publishChapter(work.id, chapter.id, {
        expectedVersion: archived.version,
        targetState: "published",
      }),
    ).rejects.toMatchObject({ code: "CONTENT_TRANSITION_CONFLICT" });
    const restored = await publications.publishChapter(work.id, chapter.id, {
      expectedVersion: archived.version,
      targetState: "draft",
    });
    expect(restored).toMatchObject({
      publicationStatus: "draft",
      publicationEventId: null,
    });
    expect(
      await database.publicationEvent.count({
        where: { chapterId: chapter.id },
      }),
    ).toBe(2);
  });
});
