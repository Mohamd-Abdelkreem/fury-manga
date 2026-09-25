import { createDatabaseClient } from "@fury/database";
import type { StructuredTextDocument } from "@fury/contracts";
import { randomUUID } from "node:crypto";
import { afterAll, beforeEach, describe, expect, it } from "vitest";

import {
  ContentImmutableException,
  ContentStaleWriteException,
  ContentTransitionConflictException,
  ContentTypeConflictException,
} from "./content.errors.js";
import { CategoryManagementService } from "./category-management.service.js";
import { ChapterManagementService } from "./chapter-management.service.js";
import { PublicationManagementService } from "./publication-management.service.js";
import { WorkManagementService } from "./work-management.service.js";

const databaseUrl = process.env["DATABASE_URL"];
if (databaseUrl === undefined) {
  throw new Error("The Testcontainers DATABASE_URL was not provided.");
}

const database = createDatabaseClient(databaseUrl);
const categories = new CategoryManagementService(database);
const works = new WorkManagementService(database);
const chapters = new ChapterManagementService(database);
const publications = new PublicationManagementService(database, {
  currentTime: () => new Date(),
  createIdentifier: randomUUID,
});
const service = {
  createCategory: categories.createCategory.bind(categories),
  listCategories: categories.listCategories.bind(categories),
  createWork: works.createWork.bind(works),
  getWork: works.getWork.bind(works),
  updateWork: works.updateWork.bind(works),
  replaceWorkCategories: works.replaceWorkCategories.bind(works),
  createChapter: chapters.createChapter.bind(chapters),
  getChapter: chapters.getChapter.bind(chapters),
  updateChapter: chapters.updateChapter.bind(chapters),
  publishWork: publications.publishWork.bind(publications),
  publishChapter: publications.publishChapter.bind(publications),
};

const pagination = { page: 1, limit: 25, skip: 0, take: 25 };

const firstTextDocument = {
  version: 1,
  blocks: [{ type: "paragraph", content: [{ text: "النص الأول" }] }],
} satisfies StructuredTextDocument;

const secondTextDocument = {
  version: 1,
  blocks: [{ type: "heading", level: 2, text: "النص المعدل" }],
} satisfies StructuredTextDocument;

describe("focused content management services with PostgreSQL", () => {
  beforeEach(async () => {
    await database.$executeRawUnsafe(
      "TRUNCATE media_reference_events, media_references, upload_attempts, media_assets, publication_events, chapter_pages, chapters, work_categories, categories, works",
    );
  });

  afterAll(async () => {
    await database.$disconnect();
  });

  it("creates durable records and preserves idempotent category replacement", async () => {
    const category = await service.createCategory({
      displayName: "Action",
      slug: "action",
    });
    const work = await service.createWork({
      title: "Durable Work",
      slug: "durable-work",
      type: "manga",
      storyStatus: "ongoing",
    });
    const assigned = await service.replaceWorkCategories(work.id, {
      expectedVersion: 0,
      categoryIds: [category.id],
    });
    const repeated = await service.replaceWorkCategories(work.id, {
      expectedVersion: 0,
      categoryIds: [category.id],
    });
    const chapter = await service.createChapter(work.id, {
      number: 1,
      pages: [{ position: 2 }, { position: 1 }],
    });

    expect(assigned.version).toBe(1);
    expect(repeated.version).toBe(1);
    expect(chapter.pages.map(({ position }) => position)).toEqual([1, 2]);
    await database.$disconnect();
    await database.$connect();
    await expect(service.getWork(work.id)).resolves.toMatchObject({
      id: work.id,
      categories: [{ id: category.id }],
    });
    await expect(
      service.getChapter(work.id, chapter.id),
    ).resolves.toMatchObject({
      id: chapter.id,
      pages: [{ position: 1 }, { position: 2 }],
    });
  });

  it("treats simultaneous identical category replacements as idempotent success", async () => {
    const category = await service.createCategory({
      displayName: "Concurrent",
      slug: "concurrent",
    });
    const work = await service.createWork({
      title: "Concurrent Work",
      slug: "concurrent-work",
      type: "manga",
      storyStatus: "ongoing",
    });
    const command = {
      expectedVersion: 0,
      categoryIds: [category.id],
    };

    const [first, second] = await Promise.all([
      service.replaceWorkCategories(work.id, command),
      service.replaceWorkCategories(work.id, command),
    ]);

    expect(first).toMatchObject({
      id: work.id,
      version: 1,
      categories: [{ id: category.id }],
    });
    expect(second).toMatchObject({
      id: work.id,
      version: 1,
      categories: [{ id: category.id }],
    });
    await expect(
      database.workCategory.count({ where: { workId: work.id } }),
    ).resolves.toBe(1);
    await database.$disconnect();
    await database.$connect();
    await expect(service.getWork(work.id)).resolves.toMatchObject({
      id: work.id,
      version: 1,
      categories: [{ id: category.id }],
    });
  });

  it("enforces immutable Work identity and stale authoritative set changes", async () => {
    const first = await service.createCategory({
      displayName: "First",
      slug: "first",
    });
    const second = await service.createCategory({
      displayName: "Second",
      slug: "second",
    });
    const work = await service.createWork({
      title: "Immutable Work",
      slug: "immutable-work",
      type: "manga",
      storyStatus: "ongoing",
    });

    await expect(
      service.updateWork(work.id, {
        expectedVersion: 0,
        type: "novel",
      }),
    ).rejects.toBeInstanceOf(ContentImmutableException);
    await expect(
      service.updateWork(work.id, {
        expectedVersion: 0,
        type: "manga",
      }),
    ).resolves.toMatchObject({ version: 0, type: "manga" });

    await service.replaceWorkCategories(work.id, {
      expectedVersion: 0,
      categoryIds: [first.id],
    });
    await expect(
      service.replaceWorkCategories(work.id, {
        expectedVersion: 0,
        categoryIds: [second.id],
      }),
    ).rejects.toBeInstanceOf(ContentStaleWriteException);
    await expect(service.getWork(work.id)).resolves.toMatchObject({
      categories: [{ id: first.id }],
      version: 1,
    });
  });

  it("rolls back Chapter content and version when a dependent page write fails", async () => {
    const work = await service.createWork({
      title: "Rollback Work",
      slug: "rollback-work",
      type: "manga",
      storyStatus: "ongoing",
    });
    const chapter = await service.createChapter(work.id, {
      number: 1,
      pages: [{ position: 1 }],
    });

    await database.$executeRawUnsafe(
      "CREATE FUNCTION fail_test_chapter_page_insert() RETURNS TRIGGER LANGUAGE plpgsql AS 'BEGIN IF NEW.position = 3 THEN RAISE EXCEPTION ''forced page failure''; END IF; RETURN NEW; END;'",
    );
    await database.$executeRawUnsafe(
      "CREATE TRIGGER fail_test_chapter_page_insert_trigger BEFORE INSERT ON chapter_pages FOR EACH ROW EXECUTE FUNCTION fail_test_chapter_page_insert()",
    );
    try {
      await expect(
        service.updateChapter(work.id, chapter.id, {
          expectedVersion: 0,
          number: 2,
          pages: [{ position: 3 }],
        }),
      ).rejects.toBeDefined();
    } finally {
      await database.$executeRawUnsafe(
        "DROP TRIGGER fail_test_chapter_page_insert_trigger ON chapter_pages",
      );
      await database.$executeRawUnsafe(
        "DROP FUNCTION fail_test_chapter_page_insert()",
      );
    }
    await expect(
      service.getChapter(work.id, chapter.id),
    ).resolves.toMatchObject({
      number: 1,
      version: 0,
      pages: [{ position: 1 }],
    });
  });

  it("creates and replaces only the representation derived from the parent Work", async () => {
    const textWork = await service.createWork({
      title: "Text Work",
      slug: "text-work",
      type: "text-story",
      storyStatus: "ongoing",
    });
    const textChapter = await service.createChapter(textWork.id, {
      number: 1,
      textContent: firstTextDocument,
    });
    const updatedTextChapter = await service.updateChapter(
      textWork.id,
      textChapter.id,
      {
        expectedVersion: 0,
        textContent: secondTextDocument,
      },
    );
    expect(updatedTextChapter).toMatchObject({
      contentType: "text",
      textContent: secondTextDocument,
      pages: [],
      version: 1,
    });

    await expect(
      service.createChapter(textWork.id, {
        number: 2,
        pages: [{ position: 1 }],
      }),
    ).rejects.toBeInstanceOf(ContentTypeConflictException);

    const illustratedWork = await service.createWork({
      title: "Illustrated Work",
      slug: "illustrated-work",
      type: "manga",
      storyStatus: "ongoing",
    });
    await expect(
      service.createChapter(illustratedWork.id, {
        number: 1,
        textContent: firstTextDocument,
      }),
    ).rejects.toBeInstanceOf(ContentTypeConflictException);
    await expect(database.chapter.count()).resolves.toBe(1);
  });

  it("rejects empty, duplicate, and stale illustrated replacements without change", async () => {
    const work = await service.createWork({
      title: "Representation Work",
      slug: "representation-work",
      type: "manga",
      storyStatus: "ongoing",
    });
    const emptyDraft = await service.createChapter(work.id, { number: 1 });
    expect(emptyDraft.pages).toEqual([]);

    await expect(
      service.updateChapter(work.id, emptyDraft.id, {
        expectedVersion: 0,
        pages: [],
      }),
    ).rejects.toBeInstanceOf(ContentTypeConflictException);

    const ready = await service.updateChapter(work.id, emptyDraft.id, {
      expectedVersion: 0,
      pages: [{ position: 2 }, { position: 1 }],
    });
    expect(ready.pages.map(({ position }) => position)).toEqual([1, 2]);
    await expect(
      service.updateChapter(work.id, emptyDraft.id, {
        expectedVersion: 1,
        pages: [{ position: 1 }, { position: 1 }],
      }),
    ).rejects.toBeInstanceOf(ContentTypeConflictException);
    await expect(
      service.updateChapter(work.id, emptyDraft.id, {
        expectedVersion: 0,
        pages: [{ position: 3 }],
      }),
    ).rejects.toBeInstanceOf(ContentStaleWriteException);
    await expect(
      service.getChapter(work.id, emptyDraft.id),
    ).resolves.toMatchObject({
      version: 1,
      pages: [{ position: 1 }, { position: 2 }],
    });
  });

  it("creates immutable publication history only for real eligible transitions", async () => {
    const work = await service.createWork({
      title: "Publication Work",
      slug: "publication-work",
      type: "manga",
      storyStatus: "ongoing",
    });
    const emptyChapter = await service.createChapter(work.id, { number: 1 });

    await expect(
      service.publishChapter(work.id, emptyChapter.id, {
        expectedVersion: 0,
        targetState: "published",
      }),
    ).rejects.toBeInstanceOf(ContentTransitionConflictException);
    await expect(database.publicationEvent.count()).resolves.toBe(0);

    const readyChapter = await service.updateChapter(work.id, emptyChapter.id, {
      expectedVersion: 0,
      pages: [{ position: 1 }],
    });
    const publishedWork = await service.publishWork(work.id, {
      expectedVersion: 0,
      targetState: "published",
    });
    const publishedChapter = await service.publishChapter(
      work.id,
      readyChapter.id,
      {
        expectedVersion: readyChapter.version,
        targetState: "published",
      },
    );
    const repeated = await service.publishChapter(work.id, readyChapter.id, {
      expectedVersion: readyChapter.version,
      targetState: "published",
    });

    expect(publishedWork.transitioned).toBe(true);
    expect(publishedChapter.transitioned).toBe(true);
    expect(repeated).toMatchObject({
      transitioned: false,
      publicationEventId: publishedChapter.publicationEventId,
      version: publishedChapter.version,
    });
    await expect(database.publicationEvent.count()).resolves.toBe(2);

    const unpublished = await service.publishChapter(work.id, readyChapter.id, {
      expectedVersion: publishedChapter.version,
      targetState: "draft",
    });
    const republished = await service.publishChapter(work.id, readyChapter.id, {
      expectedVersion: unpublished.version,
      targetState: "published",
    });
    expect(republished.publicationEventId).not.toBe(
      publishedChapter.publicationEventId,
    );
    await expect(database.publicationEvent.count()).resolves.toBe(3);
    await database.$disconnect();
    await database.$connect();
    await expect(
      database.publicationEvent.findMany({
        where: { chapterId: readyChapter.id },
        orderBy: [{ occurredAt: "asc" }, { id: "asc" }],
      }),
    ).resolves.toHaveLength(2);
  });

  it("persists the injected publication identity and time atomically", async () => {
    const eventId = "77777777-7777-4777-8777-777777777777";
    const occurredAt = new Date("2026-09-22T12:34:56.000Z");
    const deterministicPublication = new PublicationManagementService(
      database,
      {
        currentTime: () => occurredAt,
        createIdentifier: () => eventId,
      },
    );
    const work = await works.createWork({
      title: "Deterministic Publication",
      slug: "deterministic-publication",
      type: "manga",
      storyStatus: "ongoing",
    });

    const transition = await deterministicPublication.publishWork(work.id, {
      expectedVersion: 0,
      targetState: "published",
    });

    expect(transition).toMatchObject({
      publicationEventId: eventId,
      publishedAt: occurredAt.toISOString(),
      transitioned: true,
    });
    await expect(
      database.publicationEvent.findUniqueOrThrow({ where: { id: eventId } }),
    ).resolves.toMatchObject({ workId: work.id, occurredAt });
  });

  it("converges simultaneous publication commands without orphan events", async () => {
    const work = await service.createWork({
      title: "Race Work",
      slug: "race-work",
      type: "manga",
      storyStatus: "ongoing",
    });
    const outcomes = await Promise.allSettled([
      service.publishWork(work.id, {
        expectedVersion: 0,
        targetState: "published",
      }),
      service.publishWork(work.id, {
        expectedVersion: 0,
        targetState: "archived",
      }),
    ]);
    expect(
      outcomes.filter(({ status }) => status === "fulfilled"),
    ).toHaveLength(1);
    const stored = await database.work.findUniqueOrThrow({
      where: { id: work.id },
    });
    expect(stored.version).toBe(1);
    const events = await database.publicationEvent.findMany({
      where: { workId: work.id },
    });
    expect(events).toHaveLength(
      stored.publicationStatus === "PUBLISHED" ? 1 : 0,
    );
    expect(
      events.every(({ id }) => id === stored.currentPublicationEventId),
    ).toBe(true);
  });

  it("enforces archive recovery and parent-child lifecycle independence", async () => {
    const work = await service.createWork({
      title: "Recovery Work",
      slug: "recovery-work",
      type: "manga",
      storyStatus: "ongoing",
    });
    const chapter = await service.createChapter(work.id, {
      number: 1,
      pages: [{ position: 1 }],
    });
    const publishedWork = await service.publishWork(work.id, {
      expectedVersion: 0,
      targetState: "published",
    });
    const publishedChapter = await service.publishChapter(work.id, chapter.id, {
      expectedVersion: 0,
      targetState: "published",
    });
    const archived = await service.publishWork(work.id, {
      expectedVersion: publishedWork.version,
      targetState: "archived",
    });
    const repeatedArchive = await service.publishWork(work.id, {
      expectedVersion: publishedWork.version,
      targetState: "archived",
    });
    expect(repeatedArchive).toMatchObject({
      transitioned: false,
      publicationStatus: "archived",
      version: archived.version,
    });
    await expect(
      service.publishWork(work.id, {
        expectedVersion: archived.version,
        targetState: "published",
      }),
    ).rejects.toBeInstanceOf(ContentTransitionConflictException);

    const restored = await service.publishWork(work.id, {
      expectedVersion: archived.version,
      targetState: "draft",
    });
    const republished = await service.publishWork(work.id, {
      expectedVersion: restored.version,
      targetState: "published",
    });
    expect(republished.publicationEventId).not.toBe(
      publishedWork.publicationEventId,
    );
    const storedChapter = await service.getChapter(work.id, chapter.id);
    expect(storedChapter).toMatchObject({
      publicationStatus: "published",
      version: publishedChapter.version,
    });
    expect(storedChapter).not.toHaveProperty("publicationEventId");
    await expect(
      database.publicationEvent.count({ where: { workId: work.id } }),
    ).resolves.toBe(2);
  });

  it("converges simultaneous identical publishes on one persisted event", async () => {
    const work = await service.createWork({
      title: "Identical Race Work",
      slug: "identical-race-work",
      type: "manga",
      storyStatus: "ongoing",
    });
    const outcomes = await Promise.all([
      service.publishWork(work.id, {
        expectedVersion: 0,
        targetState: "published",
      }),
      service.publishWork(work.id, {
        expectedVersion: 0,
        targetState: "published",
      }),
    ]);
    expect(outcomes.map(({ transitioned }) => transitioned).sort()).toEqual([
      false,
      true,
    ]);
    expect(
      new Set(outcomes.map(({ publicationEventId }) => publicationEventId)),
    ).toHaveLength(1);
    await expect(
      database.publicationEvent.count({ where: { workId: work.id } }),
    ).resolves.toBe(1);
    await database.$disconnect();
    await database.$connect();
    await expect(service.getWork(work.id)).resolves.toMatchObject({
      publicationStatus: "published",
      version: 1,
    });
  });

  it("rolls back a publication event when the aggregate update fails", async () => {
    const work = await service.createWork({
      title: "Forced Rollback Work",
      slug: "forced-rollback-work",
      type: "manga",
      storyStatus: "ongoing",
    });
    await database.$executeRawUnsafe(
      "CREATE FUNCTION fail_test_work_publication() RETURNS TRIGGER LANGUAGE plpgsql AS 'BEGIN IF NEW.publication_status = ''published'' THEN RAISE EXCEPTION ''forced test failure''; END IF; RETURN NEW; END;'",
    );
    await database.$executeRawUnsafe(
      "CREATE TRIGGER fail_test_work_publication_trigger BEFORE UPDATE ON works FOR EACH ROW EXECUTE FUNCTION fail_test_work_publication()",
    );
    try {
      await expect(
        service.publishWork(work.id, {
          expectedVersion: 0,
          targetState: "published",
        }),
      ).rejects.toBeDefined();
    } finally {
      await database.$executeRawUnsafe(
        "DROP TRIGGER fail_test_work_publication_trigger ON works",
      );
      await database.$executeRawUnsafe(
        "DROP FUNCTION fail_test_work_publication()",
      );
    }
    await expect(database.publicationEvent.count()).resolves.toBe(0);
    await expect(
      database.work.findUniqueOrThrow({ where: { id: work.id } }),
    ).resolves.toMatchObject({
      publicationStatus: "DRAFT",
      currentPublicationEventId: null,
      version: 0,
    });
  });

  it("keeps list totals and deterministic ordering bounded", async () => {
    await service.createCategory({ displayName: "B", slug: "b" });
    await service.createCategory({ displayName: "A", slug: "a" });
    const result = await service.listCategories(pagination);
    expect(result.items).toHaveLength(2);
    expect(result.pagination).toMatchObject({ total: 2, page: 1, limit: 25 });
  });
});
