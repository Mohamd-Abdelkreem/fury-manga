import { createDatabaseClient } from "@fury/database";
import type { StructuredTextDocument } from "@fury/contracts";
import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";

import {
  ContentImmutableException,
  ContentStaleWriteException,
  ContentTransitionConflictException,
  ContentNotReadyException,
  ContentTypeConflictException,
} from "./content.errors.js";
import { CategoryManagementService } from "./category-management.service.js";
import { ChapterManagementService } from "./chapter-management.service.js";
import { PublicationManagementService } from "./publication-management.service.js";
import { WorkManagementService } from "./work-management.service.js";
import { prepareWorkForPublication } from "../../test-support/content-publication-fixture.test-helper.js";

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
const fixtureActorIds: string[] = [];
let chapterActorId: string;

beforeAll(async () => {
  chapterActorId = randomUUID();
  fixtureActorIds.push(chapterActorId);
  await database.user.create({
    data: {
      id: chapterActorId,
      email: `chapter-${chapterActorId}@example.test`,
      fullName: "Chapter Admin",
      passwordHash: "test-hash",
      role: "ADMIN",
      status: "ACTIVE",
      emailVerifiedAt: new Date(),
    },
  });
});

const createPageAsset = async (): Promise<string> => {
  const asset = await database.mediaAsset.create({
    data: {
      mediaClass: "CHAPTER_PAGE",
      scope: "ADMIN",
      uploadedByUserId: chapterActorId,
      relativeKey: `chapter-${randomUUID()}`,
      contentType: "image/webp",
      byteLength: 100,
      width: 10,
      height: 10,
      sha256: "a".repeat(64),
      status: "AVAILABLE",
      availableAt: new Date(),
    },
  });
  return asset.id;
};

const makeReady = async (workId: string): Promise<void> => {
  fixtureActorIds.push(await prepareWorkForPublication(database, workId));
};

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
      "TRUNCATE media_reference_events, media_references, upload_attempts, media_assets, publication_events, chapter_pages, chapters, work_tags, work_categories, categories, works",
    );
  });

  afterAll(async () => {
    await database.$executeRawUnsafe(
      "TRUNCATE media_reference_events, media_references, upload_attempts, media_assets, publication_events, chapter_pages, chapters, work_tags, work_categories, categories, works",
    );
    await database.user.deleteMany({ where: { id: { in: fixtureActorIds } } });
    await database.$disconnect();
  });

  it("lists one Work's filtered Chapter summaries with stable pages and truthful totals", async () => {
    const work = await works.createWork({
      title: "List Work",
      slug: `list-${randomUUID()}`,
      type: "text-story",
      storyStatus: "ongoing",
    });
    const otherWork = await works.createWork({
      title: "Other Work",
      slug: `other-${randomUUID()}`,
      type: "text-story",
      storyStatus: "ongoing",
    });
    const saved = [];
    for (let number = 1; number <= 5; number += 1) {
      saved.push(
        await chapters.createChapter(
          work.id,
          {
            number,
            title: number === 3 ? "Café middle" : `Chapter ${String(number)}`,
            textContent: firstTextDocument,
          },
          chapterActorId,
        ),
      );
    }
    await chapters.createChapter(
      otherWork.id,
      { number: 9, title: "Café other", textContent: firstTextDocument },
      chapterActorId,
    );
    const second = saved[1];
    const fourth = saved[3];
    if (second === undefined || fourth === undefined)
      throw new Error("Expected Chapter fixtures.");
    await publications.publishChapter(work.id, second.id, {
      expectedVersion: 0,
      targetState: "published",
    });
    await publications.publishChapter(work.id, fourth.id, {
      expectedVersion: 0,
      targetState: "archived",
    });
    for (const [index, chapter] of saved.entries()) {
      await database.chapter.update({
        where: { id: chapter.id },
        data: { updatedAt: new Date(Date.UTC(2026, 8, index + 1)) },
      });
    }

    const first = await chapters.listChapters(
      work.id,
      { page: 1, limit: 2, skip: 0, take: 2 },
      { page: 1, limit: 2, sort: "number_desc" },
    );
    expect(first.items.map(({ number }) => number)).toEqual([5, 4]);
    expect(first.pagination).toMatchObject({
      total: 5,
      totalPages: 3,
      hasNextPage: true,
    });
    expect(first.items[0]).not.toHaveProperty("textContent");
    expect(first.items[0]).not.toHaveProperty("pages");
    const overrun = await chapters.listChapters(
      work.id,
      { page: 9, limit: 2, skip: 16, take: 2 },
      { page: 9, limit: 2, sort: "number_desc" },
    );
    expect(overrun).toMatchObject({
      items: [],
      pagination: { total: 5, totalPages: 3 },
    });
    const titleMatch = await chapters.listChapters(work.id, pagination, {
      page: 1,
      limit: 25,
      sort: "number_asc",
      search: "café",
    });
    expect(titleMatch.items.map(({ number }) => number)).toEqual([3]);
    const numberMatch = await chapters.listChapters(work.id, pagination, {
      page: 1,
      limit: 25,
      sort: "number_asc",
      search: "2",
    });
    expect(numberMatch.items.map(({ number }) => number)).toEqual([2]);
    const published = await chapters.listChapters(work.id, pagination, {
      page: 1,
      limit: 25,
      sort: "published_desc",
      publicationStatus: "published",
    });
    expect(published.items.map(({ number }) => number)).toEqual([2]);
    expect(published.pagination.total).toBe(1);
    const dates = await chapters.listChapters(work.id, pagination, {
      page: 1,
      limit: 25,
      sort: "published_desc",
    });
    expect(dates.items.map(({ number }) => number)[0]).toBe(2);
    expect(
      dates.items.slice(1).every(({ publishedAt }) => publishedAt === null),
    ).toBe(true);
    const updated = await chapters.listChapters(work.id, pagination, {
      page: 1,
      limit: 25,
      sort: "updated_desc",
    });
    expect(updated.items.map(({ number }) => number)).toEqual([5, 4, 3, 2, 1]);
    const empty = await chapters.listChapters(work.id, pagination, {
      page: 1,
      limit: 25,
      sort: "number_asc",
      search: "missing",
    });
    expect(empty).toMatchObject({ items: [], pagination: { total: 0 } });
    const emptyWork = await works.createWork({
      title: "Empty Work",
      slug: `empty-${randomUUID()}`,
      type: "text-story",
      storyStatus: "ongoing",
    });
    await expect(
      chapters.listChapters(emptyWork.id, pagination, {
        page: 1,
        limit: 25,
        sort: "number_asc",
      }),
    ).resolves.toMatchObject({
      items: [],
      pagination: { total: 0, totalPages: 0 },
    });
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
    const firstPageAssetId = await createPageAsset();
    const secondPageAssetId = await createPageAsset();
    const chapter = await service.createChapter(
      work.id,
      {
        number: 1,
        title: "Durable Chapter",
        pages: [{ assetId: firstPageAssetId }, { assetId: secondPageAssetId }],
      },
      chapterActorId,
    );

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
    const firstPageAssetId = await createPageAsset();
    const replacementAssetId = await createPageAsset();
    const chapter = await service.createChapter(
      work.id,
      {
        number: 1,
        title: "Rollback Chapter",
        pages: [{ assetId: firstPageAssetId }],
      },
      chapterActorId,
    );

    const originalPage = chapter.pages[0];
    if (originalPage === undefined) throw new Error("Missing fixture page");

    await database.$executeRawUnsafe(
      "CREATE FUNCTION fail_test_chapter_page_insert() RETURNS TRIGGER LANGUAGE plpgsql AS 'BEGIN RAISE EXCEPTION ''forced reference failure''; END;'",
    );
    await database.$executeRawUnsafe(
      "CREATE TRIGGER fail_test_chapter_page_insert_trigger BEFORE INSERT ON media_reference_events FOR EACH ROW EXECUTE FUNCTION fail_test_chapter_page_insert()",
    );
    try {
      await expect(
        service.updateChapter(
          work.id,
          chapter.id,
          {
            expectedVersion: 0,
            number: 2,
            pages: [{ id: originalPage.id, assetId: replacementAssetId }],
          },
          chapterActorId,
        ),
      ).rejects.toBeDefined();
    } finally {
      await database.$executeRawUnsafe(
        "DROP TRIGGER fail_test_chapter_page_insert_trigger ON media_reference_events",
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

  it("reorders, replaces and removes illustrated pages with durable identity and history", async () => {
    const work = await service.createWork({
      title: "Page History Work",
      slug: "page-history-work",
      type: "manga",
      storyStatus: "ongoing",
    });
    const firstAsset = await createPageAsset();
    const secondAsset = await createPageAsset();
    const replacementAsset = await createPageAsset();
    const created = await service.createChapter(
      work.id,
      {
        number: 1,
        title: "History Chapter",
        pages: [{ assetId: firstAsset }, { assetId: secondAsset }],
      },
      chapterActorId,
    );
    const [first, second] = created.pages;
    if (first === undefined || second === undefined)
      throw new Error("Missing fixture pages");
    const reordered = await service.updateChapter(
      work.id,
      created.id,
      {
        expectedVersion: 0,
        pages: [
          { id: second.id, assetId: secondAsset },
          { id: first.id, assetId: firstAsset },
        ],
      },
      chapterActorId,
    );
    expect(
      reordered.pages.map(({ id, position }) => ({ id, position })),
    ).toEqual([
      { id: second.id, position: 1 },
      { id: first.id, position: 2 },
    ]);
    const replaced = await service.updateChapter(
      work.id,
      created.id,
      {
        expectedVersion: 1,
        pages: [{ id: second.id, assetId: replacementAsset }],
      },
      chapterActorId,
    );
    expect(replaced.pages).toMatchObject([
      { id: second.id, assetId: replacementAsset, position: 1 },
    ]);
    await database.$disconnect();
    await database.$connect();
    await expect(
      service.getChapter(work.id, created.id),
    ).resolves.toMatchObject({
      version: 2,
      pages: [{ id: second.id, assetId: replacementAsset, position: 1 }],
    });
    const retiredPage = await database.chapterPage.findUniqueOrThrow({
      where: { id: first.id },
    });
    expect(retiredPage.chapterId).toBe(created.id);
    expect(retiredPage.retiredAt).toBeInstanceOf(Date);
    const references = await database.mediaReference.findMany({
      where: { chapterPageId: { in: [first.id, second.id] } },
      orderBy: { chapterPageId: "asc" },
    });
    expect(references).toHaveLength(2);
    expect(
      references.find(({ chapterPageId }) => chapterPageId === first.id)
        ?.retiredAt,
    ).toBeInstanceOf(Date);
    expect(
      references.find(({ chapterPageId }) => chapterPageId === second.id)
        ?.assetId,
    ).toBe(replacementAsset);
    await expect(
      database.mediaReferenceEvent.count({
        where: { referenceId: { in: references.map(({ id }) => id) } },
      }),
    ).resolves.toBe(4);
  });

  it("accepts one concurrent page revision and rejects the stale contender", async () => {
    const work = await service.createWork({
      title: "Concurrent Pages",
      slug: "concurrent-pages",
      type: "manga",
      storyStatus: "ongoing",
    });
    const assetId = await createPageAsset();
    const chapter = await service.createChapter(
      work.id,
      {
        number: 1,
        title: "Concurrent Chapter",
        pages: [{ assetId }],
      },
      chapterActorId,
    );
    const page = chapter.pages[0];
    if (page === undefined) throw new Error("Missing fixture page");
    const command = { expectedVersion: 0, pages: [{ id: page.id, assetId }] };
    const outcomes = await Promise.allSettled([
      service.updateChapter(work.id, chapter.id, command, chapterActorId),
      service.updateChapter(work.id, chapter.id, command, chapterActorId),
    ]);
    expect(
      outcomes.filter(({ status }) => status === "fulfilled"),
    ).toHaveLength(1);
    expect(outcomes.filter(({ status }) => status === "rejected")).toHaveLength(
      1,
    );
    const rejected = outcomes.find(({ status }) => status === "rejected");
    if (rejected?.status !== "rejected")
      throw new Error("Missing rejected save");
    expect(rejected.reason).toBeInstanceOf(ContentStaleWriteException);
    await expect(
      service.getChapter(work.id, chapter.id),
    ).resolves.toMatchObject({
      version: 1,
      pages: [{ id: page.id, assetId }],
    });
  });

  it("rejects foreign page identity and unavailable or wrong-class media without committing", async () => {
    const work = await service.createWork({
      title: "Asset Validation Work",
      slug: "asset-validation-work",
      type: "manga",
      storyStatus: "ongoing",
    });
    const foreignAssetId = await createPageAsset();
    const assetId = await createPageAsset();
    const other = await service.createChapter(
      work.id,
      {
        number: 1,
        title: "Other Chapter",
        pages: [{ assetId: foreignAssetId }],
      },
      chapterActorId,
    );
    const draft = await service.createChapter(
      work.id,
      {
        number: 2,
        title: "Target Chapter",
        pages: [],
      },
      chapterActorId,
    );
    const foreignPage = other.pages[0];
    if (foreignPage === undefined) throw new Error("Missing fixture page");
    await expect(
      service.updateChapter(
        work.id,
        draft.id,
        {
          expectedVersion: 0,
          pages: [{ id: foreignPage.id, assetId }],
        },
        chapterActorId,
      ),
    ).rejects.toMatchObject({ statusCode: 404 });
    for (const status of ["PENDING", "UNAVAILABLE"] as const) {
      await database.mediaAsset.update({
        where: { id: assetId },
        data: { status },
      });
      await expect(
        service.updateChapter(
          work.id,
          draft.id,
          {
            expectedVersion: 0,
            pages: [{ assetId }],
          },
          chapterActorId,
        ),
      ).rejects.toMatchObject({ statusCode: 404 });
    }
    await database.mediaAsset.update({
      where: { id: assetId },
      data: { status: "AVAILABLE", mediaClass: "WORK_COVER" },
    });
    await expect(
      service.updateChapter(
        work.id,
        draft.id,
        {
          expectedVersion: 0,
          pages: [{ assetId }],
        },
        chapterActorId,
      ),
    ).rejects.toMatchObject({ statusCode: 404 });
    await expect(service.getChapter(work.id, draft.id)).resolves.toMatchObject({
      version: 0,
      pages: [],
    });
  });

  it("creates and replaces only the representation derived from the parent Work", async () => {
    const textWork = await service.createWork({
      title: "Text Work",
      slug: "text-work",
      type: "text-story",
      storyStatus: "ongoing",
    });
    const textChapter = await service.createChapter(
      textWork.id,
      {
        number: 1,
        title: "Text Chapter",
        textContent: firstTextDocument,
      },
      chapterActorId,
    );
    const updatedTextChapter = await service.updateChapter(
      textWork.id,
      textChapter.id,
      {
        expectedVersion: 0,
        textContent: secondTextDocument,
      },
      chapterActorId,
    );
    expect(updatedTextChapter).toMatchObject({
      contentType: "text",
      textContent: secondTextDocument,
      pages: [],
      version: 1,
    });

    await expect(
      service.createChapter(
        textWork.id,
        {
          number: 2,
          title: "Wrong Representation",
          pages: [{ assetId: randomUUID() }],
        },
        chapterActorId,
      ),
    ).rejects.toBeInstanceOf(ContentTypeConflictException);

    const illustratedWork = await service.createWork({
      title: "Illustrated Work",
      slug: "illustrated-work",
      type: "manga",
      storyStatus: "ongoing",
    });
    await expect(
      service.createChapter(
        illustratedWork.id,
        {
          number: 1,
          title: "Wrong Representation",
          textContent: firstTextDocument,
        },
        chapterActorId,
      ),
    ).rejects.toBeInstanceOf(ContentTypeConflictException);
    await expect(database.chapter.count()).resolves.toBe(1);
  });

  it("reloads an incomplete text draft and rejects an invalid edit without changing its revision", async () => {
    const work = await service.createWork({
      title: "Text Draft Work",
      slug: "text-draft-work",
      type: "novel",
      storyStatus: "ongoing",
    });
    const draft = await service.createChapter(
      work.id,
      { number: 1, title: "Draft", textContent: null },
      chapterActorId,
    );
    expect(draft).toMatchObject({ contentType: "text", textContent: null });
    const completeDocument = {
      version: 1,
      blocks: [
        { type: "heading", level: 2, text: "Opening" },
        {
          type: "paragraph",
          content: [
            { text: "Read", bold: true },
            { text: " more", href: "/stories" },
          ],
        },
        { type: "list", ordered: true, items: ["First", "Second"] },
      ],
    } satisfies StructuredTextDocument;
    const saved = await service.updateChapter(
      work.id,
      draft.id,
      { expectedVersion: 0, textContent: completeDocument },
      chapterActorId,
    );
    expect(saved.textContent).toEqual(completeDocument);
    await database.$disconnect();
    await database.$connect();
    await expect(service.getChapter(work.id, draft.id)).resolves.toMatchObject({
      textContent: completeDocument,
      version: 1,
    });
    await expect(
      service.updateChapter(
        work.id,
        draft.id,
        {
          expectedVersion: 1,
          textContent: {
            version: 1,
            blocks: [{ type: "heading", level: 2, text: "" }],
          },
        },
        chapterActorId,
      ),
    ).rejects.toBeInstanceOf(ContentTypeConflictException);
    await expect(service.getChapter(work.id, draft.id)).resolves.toMatchObject({
      textContent: completeDocument,
      version: 1,
    });
    const cleared = await service.updateChapter(
      work.id,
      draft.id,
      { expectedVersion: 1, textContent: null },
      chapterActorId,
    );
    expect(cleared).toMatchObject({ textContent: null, version: 2 });
    const restored = await service.updateChapter(
      work.id,
      draft.id,
      { expectedVersion: 2, textContent: completeDocument },
      chapterActorId,
    );
    await service.publishChapter(work.id, draft.id, {
      expectedVersion: restored.version,
      targetState: "published",
    });
    await expect(
      service.updateChapter(
        work.id,
        draft.id,
        { expectedVersion: restored.version + 1, textContent: null },
        chapterActorId,
      ),
    ).rejects.toMatchObject({ code: "CONTENT_NOT_READY" });
    await expect(service.getChapter(work.id, draft.id)).resolves.toMatchObject({
      textContent: completeDocument,
      version: restored.version + 1,
    });
  });

  it("keeps empty drafts and rejects duplicate or stale illustrated edits", async () => {
    const work = await service.createWork({
      title: "Representation Work",
      slug: "representation-work",
      type: "manga",
      storyStatus: "ongoing",
    });
    const emptyDraft = await service.createChapter(
      work.id,
      {
        number: 1,
        title: "Incomplete Chapter",
      },
      chapterActorId,
    );
    expect(emptyDraft.pages).toEqual([]);

    const cleared = await service.updateChapter(
      work.id,
      emptyDraft.id,
      {
        expectedVersion: 0,
        pages: [],
      },
      chapterActorId,
    );
    expect(cleared.pages).toEqual([]);

    const firstAssetId = await createPageAsset();
    const secondAssetId = await createPageAsset();
    const ready = await service.updateChapter(
      work.id,
      emptyDraft.id,
      {
        expectedVersion: 1,
        pages: [{ assetId: firstAssetId }, { assetId: secondAssetId }],
      },
      chapterActorId,
    );
    expect(ready.pages.map(({ position }) => position)).toEqual([1, 2]);
    const readyFirstPage = ready.pages[0];
    if (readyFirstPage === undefined) throw new Error("Missing fixture page");
    await expect(
      service.updateChapter(
        work.id,
        emptyDraft.id,
        {
          expectedVersion: 2,
          pages: [
            { id: readyFirstPage.id, assetId: firstAssetId },
            { id: readyFirstPage.id, assetId: secondAssetId },
          ],
        },
        chapterActorId,
      ),
    ).rejects.toBeInstanceOf(ContentTypeConflictException);
    await expect(
      service.updateChapter(
        work.id,
        emptyDraft.id,
        {
          expectedVersion: 0,
          pages: [{ id: readyFirstPage.id, assetId: firstAssetId }],
        },
        chapterActorId,
      ),
    ).rejects.toBeInstanceOf(ContentStaleWriteException);
    await expect(
      service.getChapter(work.id, emptyDraft.id),
    ).resolves.toMatchObject({
      version: 2,
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
    await makeReady(work.id);
    const emptyChapter = await service.createChapter(
      work.id,
      {
        number: 1,
        title: "Publication Chapter",
      },
      chapterActorId,
    );

    await expect(
      service.publishChapter(work.id, emptyChapter.id, {
        expectedVersion: 0,
        targetState: "published",
      }),
    ).rejects.toBeInstanceOf(ContentNotReadyException);
    await expect(database.publicationEvent.count()).resolves.toBe(0);

    const pageAssetId = await createPageAsset();
    const readyChapter = await service.updateChapter(
      work.id,
      emptyChapter.id,
      {
        expectedVersion: 0,
        pages: [{ assetId: pageAssetId }],
      },
      chapterActorId,
    );
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
    await makeReady(work.id);

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
    await makeReady(work.id);
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
    await makeReady(work.id);
    const pageAssetId = await createPageAsset();
    const chapter = await service.createChapter(
      work.id,
      {
        number: 1,
        title: "Recovery Chapter",
        pages: [{ assetId: pageAssetId }],
      },
      chapterActorId,
    );
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
    await makeReady(work.id);
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
    await makeReady(work.id);
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
