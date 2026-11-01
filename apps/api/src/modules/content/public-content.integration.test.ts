import { type Prisma, createDatabaseClient } from "@fury/database";
import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";

import { NotFoundException } from "../../core/errors/not-found.error.js";
import {
  catalogWorkListQuerySchema,
  catalogCategoryListQuerySchema,
  catalogWorkSchema,
  type WorkType,
  type PublicationStatus,
} from "@fury/contracts";
import type { PublicContentDatabase } from "./content.types.js";
import { CategoryManagementService } from "./category-management.service.js";
import { ChapterManagementService } from "./chapter-management.service.js";
import { inventoryPublishedText } from "./chapter-readiness-inventory.js";
import { PublicationManagementService } from "./publication-management.service.js";
import { PublicContentService } from "./public-content.service.js";
import { WorkManagementService } from "./work-management.service.js";
import { prepareWorkForPublication } from "../../test-support/content-publication-fixture.test-helper.js";

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
const fixtureActorIds: string[] = [];
let chapterActorId: string;

beforeAll(async () => {
  chapterActorId = randomUUID();
  fixtureActorIds.push(chapterActorId);
  await database.user.create({
    data: {
      id: chapterActorId,
      email: `public-chapter-${chapterActorId}@example.test`,
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
      relativeKey: `public-chapter-${randomUUID()}`,
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

const createCatalogWork = async (
  title: string,
  type: WorkType = "manga",
  categoryId?: string,
) => {
  const work = await works.createWork({
    title,
    slug: `catalog-${randomUUID()}`,
    type,
    storyStatus: "ongoing",
  });
  fixtureActorIds.push(
    await prepareWorkForPublication(database, work.id, categoryId),
  );
  const fixturePublications = new PublicationManagementService(database, {
    currentTime: () => new Date("2026-09-27T12:00:00.000Z"),
    createIdentifier: randomUUID,
  });
  const published = await fixturePublications.publishWork(work.id, {
    expectedVersion: 0,
    targetState: "published",
  });
  return { ...work, version: published.version };
};

const observeSnapshot = () => {
  let observed!: () => void;
  let release!: () => void;
  const started = new Promise<void>((resolve) => {
    observed = resolve;
  });
  const barrier = new Promise<void>((resolve) => {
    release = resolve;
  });
  const querySizes: number[] = [];
  let intercepted = false;
  const observedDatabase: PublicContentDatabase = {
    $transaction: (read, options) =>
      database.$transaction(
        (transaction) =>
          read({
            work: transaction.work,
            chapter: transaction.chapter,
            category: transaction.category,
            mediaAsset: transaction.mediaAsset,
            $queryRaw: async <T>(
              query: TemplateStringsArray | Prisma.Sql,
              ...values: unknown[]
            ): Promise<T> => {
              const result = await transaction.$queryRaw<T>(query, ...values);
              if (Array.isArray(result)) querySizes.push(result.length);
              if (!intercepted) {
                intercepted = true;
                observed();
                await barrier;
              }
              return result;
            },
          }),
        options,
      ),
  };
  return {
    reader: new PublicContentService(observedDatabase),
    started,
    release,
    querySizes,
  };
};

describe("PublicContentService with PostgreSQL", () => {
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

  it("returns only jointly eligible allowlisted metadata and hides it again", async () => {
    const work = await works.createWork({
      title: "Visible Work",
      slug: "visible-work",
      type: "manga",
      storyStatus: "ongoing",
    });
    const pageAssetId = await createPageAsset();
    const chapter = await chapters.createChapter(
      work.id,
      {
        number: 1,
        title: "Visible Chapter",
        pages: [{ assetId: pageAssetId }],
      },
      chapterActorId,
    );
    fixtureActorIds.push(await prepareWorkForPublication(database, work.id));
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
    expect(visibleChapter).toEqual({
      id: chapter.id,
      workId: work.id,
      number: 1,
      title: "Visible Chapter",
      contentType: "illustrated",
      publishedAt: visibleChapter.publishedAt,
    });
    expect(typeof visibleChapter.publishedAt).toBe("string");
    expect(
      (await publicContent.listChapters(work.slug, pagination)).items,
    ).toEqual([visibleChapter]);
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

  it("hides an illustrated Chapter while a saved image is unavailable and restores it after repair", async () => {
    const work = await works.createWork({
      title: "Repairable Work",
      slug: `repairable-${randomUUID()}`,
      type: "manga",
      storyStatus: "ongoing",
    });
    const assetId = await createPageAsset();
    const chapter = await chapters.createChapter(
      work.id,
      {
        number: 1,
        title: "Repairable Chapter",
        pages: [{ assetId }],
      },
      chapterActorId,
    );
    fixtureActorIds.push(await prepareWorkForPublication(database, work.id));
    await publications.publishWork(work.id, {
      expectedVersion: 0,
      targetState: "published",
    });
    const published = await publications.publishChapter(work.id, chapter.id, {
      expectedVersion: 0,
      targetState: "published",
    });
    expect(
      (await publicContent.listChapters(work.slug, pagination)).pagination
        .total,
    ).toBe(1);
    await database.mediaAsset.update({
      where: { id: assetId },
      data: { status: "UNAVAILABLE" },
    });
    expect(
      (await publicContent.listChapters(work.slug, pagination)).pagination
        .total,
    ).toBe(0);
    await expect(
      publicContent.getChapter(work.slug, chapter.number),
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(
      await database.chapter.findUniqueOrThrow({ where: { id: chapter.id } }),
    ).toMatchObject({
      publicationStatus: "PUBLISHED",
      currentPublicationEventId: published.publicationEventId,
    });
    await database.mediaAsset.update({
      where: { id: assetId },
      data: { status: "AVAILABLE" },
    });
    await expect(
      publicContent.getChapter(work.slug, chapter.number),
    ).resolves.toMatchObject({ id: chapter.id });
    expect(
      (await publicContent.listChapters(work.slug, pagination)).pagination
        .total,
    ).toBe(1);
    expect(
      await database.publicationEvent.count({
        where: { chapterId: chapter.id },
      }),
    ).toBe(1);
  });

  it("rejects an empty published text document without changing public metadata", async () => {
    const work = await works.createWork({
      title: "Legacy text readiness",
      slug: `legacy-text-${randomUUID()}`,
      type: "novel",
      storyStatus: "ongoing",
    });
    const chapter = await chapters.createChapter(
      work.id,
      {
        number: 1,
        title: "Stored text",
        textContent: {
          version: 1,
          blocks: [{ type: "heading", level: 2, text: "Ready" }],
        },
      },
      chapterActorId,
    );
    fixtureActorIds.push(await prepareWorkForPublication(database, work.id));
    await publications.publishWork(work.id, {
      expectedVersion: 0,
      targetState: "published",
    });
    const published = await publications.publishChapter(work.id, chapter.id, {
      expectedVersion: 0,
      targetState: "published",
    });
    await expect(database.$executeRaw`
      UPDATE chapters SET text_content = '{"version":1,"blocks":[]}'::jsonb
      WHERE id = ${chapter.id}::uuid
    `).rejects.toThrow();
    await expect(
      publicContent.listChapters(work.slug, pagination),
    ).resolves.toMatchObject({
      items: [{ id: chapter.id, title: "Stored text" }],
      pagination: { total: 1 },
    });
    await expect(publicContent.getChapter(work.slug, 1)).resolves.toMatchObject(
      {
        id: chapter.id,
        title: "Stored text",
      },
    );
    expect(
      await database.publicationEvent.count({
        where: { chapterId: chapter.id },
      }),
    ).toBe(1);
    expect(
      (await database.chapter.findUniqueOrThrow({ where: { id: chapter.id } }))
        .currentPublicationEventId,
    ).toBe(published.publicationEventId);
  });

  it("hides malformed legacy text without changing its publication event", async () => {
    const work = await works.createWork({
      title: "Malformed text readiness",
      slug: `malformed-text-${randomUUID()}`,
      type: "novel",
      storyStatus: "ongoing",
    });
    const chapter = await chapters.createChapter(
      work.id,
      {
        number: 1,
        title: "Stored text",
        textContent: {
          version: 1,
          blocks: [{ type: "heading", level: 2, text: "Ready" }],
        },
      },
      chapterActorId,
    );
    fixtureActorIds.push(await prepareWorkForPublication(database, work.id));
    await publications.publishWork(work.id, {
      expectedVersion: 0,
      targetState: "published",
    });
    const published = await publications.publishChapter(work.id, chapter.id, {
      expectedVersion: 0,
      targetState: "published",
    });
    const malformedDocuments = [
      { version: 1, blocks: [{ type: "quote", text: "Unsupported" }] },
      { version: 1, blocks: [{ type: "heading", level: 4, text: "Wrong" }] },
      {
        version: 1,
        blocks: [
          {
            type: "paragraph",
            content: [{ text: "Link", href: "https://example.com" }],
          },
        ],
      },
      {
        version: 1,
        blocks: [
          { type: "heading", level: 2, text: "Ready", html: "<b>unsafe</b>" },
        ],
      },
      {
        version: 1,
        blocks: [{ type: "heading", level: 2, text: "😀".repeat(2001) }],
      },
    ];
    for (const document of malformedDocuments) {
      await database.chapter.update({
        where: { id: chapter.id },
        data: { textContent: document },
      });
      await expect(
        chapters.listChapters(work.id, pagination, {
          page: 1,
          limit: 25,
          sort: "number_asc",
        }),
      ).resolves.toMatchObject({
        items: [{ id: chapter.id, readyForPublication: false }],
        pagination: { total: 1 },
      });
      await expect(
        publicContent.listChapters(work.slug, pagination),
      ).resolves.toMatchObject({
        items: [],
        pagination: { total: 0 },
      });
      await expect(
        publicContent.getChapter(work.slug, 1),
      ).rejects.toBeInstanceOf(NotFoundException);
    }
    await expect(inventoryPublishedText(database)).resolves.toEqual({
      checked: 1,
      invalidIds: [chapter.id],
    });
    await database.chapter.update({
      where: { id: chapter.id },
      data: {
        textContent: {
          version: 1,
          blocks: [
            {
              type: "paragraph",
              content: [{ text: "Link", href: "/stories/ready", bold: true }],
            },
            { type: "list", ordered: false, items: ["First", "Second"] },
          ],
        },
      },
    });
    await expect(
      publicContent.listChapters(work.slug, pagination),
    ).resolves.toMatchObject({
      items: [{ id: chapter.id }],
      pagination: { total: 1 },
    });
    await expect(publicContent.getChapter(work.slug, 1)).resolves.toMatchObject(
      {
        id: chapter.id,
      },
    );
    await expect(inventoryPublishedText(database)).resolves.toEqual({
      checked: 1,
      invalidIds: [],
    });
    expect(
      await database.publicationEvent.count({
        where: { chapterId: chapter.id },
      }),
    ).toBe(1);
    expect(
      (await database.chapter.findUniqueOrThrow({ where: { id: chapter.id } }))
        .currentPublicationEventId,
    ).toBe(published.publicationEventId);
  });

  it("rejects an active illustrated page gap without changing public metadata", async () => {
    const work = await works.createWork({
      title: "Legacy page readiness",
      slug: `legacy-pages-${randomUUID()}`,
      type: "manga",
      storyStatus: "ongoing",
    });
    const chapter = await chapters.createChapter(
      work.id,
      {
        number: 1,
        title: "Stored pages",
        pages: [
          { assetId: await createPageAsset() },
          { assetId: await createPageAsset() },
        ],
      },
      chapterActorId,
    );
    fixtureActorIds.push(await prepareWorkForPublication(database, work.id));
    await publications.publishWork(work.id, {
      expectedVersion: 0,
      targetState: "published",
    });
    const published = await publications.publishChapter(work.id, chapter.id, {
      expectedVersion: 0,
      targetState: "published",
    });
    const secondPage = chapter.pages[1];
    if (secondPage === undefined) throw new Error("Expected two saved pages.");
    await expect(
      database.chapterPage.update({
        where: { id: secondPage.id },
        data: { position: 3 },
      }),
    ).rejects.toThrow();
    await expect(
      publicContent.listChapters(work.slug, pagination),
    ).resolves.toMatchObject({
      items: [{ id: chapter.id, title: "Stored pages" }],
      pagination: { total: 1 },
    });
    await expect(publicContent.getChapter(work.slug, 1)).resolves.toMatchObject(
      {
        id: chapter.id,
        title: "Stored pages",
      },
    );
    expect(
      await database.publicationEvent.count({
        where: { chapterId: chapter.id },
      }),
    ).toBe(1);
    expect(
      (await database.chapter.findUniqueOrThrow({ where: { id: chapter.id } }))
        .currentPublicationEventId,
    ).toBe(published.publicationEventId);
  });

  it("hides legacy published metadata when its last category or author becomes unavailable", async () => {
    const draft = await works.createWork({
      title: "Legacy visibility",
      slug: `legacy-${randomUUID()}`,
      type: "manga",
      storyStatus: "ongoing",
    });
    fixtureActorIds.push(await prepareWorkForPublication(database, draft.id));
    const category = await database.workCategory.findFirstOrThrow({
      where: { workId: draft.id },
    });
    const published = await publications.publishWork(draft.id, {
      expectedVersion: draft.version,
      targetState: "published",
    });
    expect(published.publicationStatus).toBe("published");
    expect((await publicContent.listWorks(pagination)).pagination.total).toBe(
      1,
    );

    // Reproduce legacy data on this isolated database while leaving the installed guard enabled afterward.
    await database.$executeRawUnsafe(
      "ALTER TABLE categories DISABLE TRIGGER trg_categories_published_ready",
    );
    try {
      await database.category.update({
        where: { id: category.categoryId },
        data: { enabled: false },
      });
    } finally {
      await database.$executeRawUnsafe(
        "ALTER TABLE categories ENABLE TRIGGER trg_categories_published_ready",
      );
    }
    await expect(publicContent.getWork(draft.slug)).rejects.toMatchObject({
      statusCode: 404,
    });
    expect((await publicContent.listWorks(pagination)).pagination.total).toBe(
      0,
    );
    await database.category.update({
      where: { id: category.categoryId },
      data: { enabled: true },
    });

    await database.$executeRawUnsafe(
      "ALTER TABLE works DISABLE TRIGGER trg_works_published_ready",
    );
    try {
      await database.work.update({
        where: { id: draft.id },
        data: { author: null },
      });
    } finally {
      await database.$executeRawUnsafe(
        "ALTER TABLE works ENABLE TRIGGER trg_works_published_ready",
      );
    }
    await expect(publicContent.getWork(draft.slug)).rejects.toMatchObject({
      statusCode: 404,
    });
    expect((await publicContent.listWorks(pagination)).pagination.total).toBe(
      0,
    );
    expect(
      await database.publicationEvent.count({ where: { workId: draft.id } }),
    ).toBe(1);
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
        const pageAssetId = await createPageAsset();
        const chapter = await chapters.createChapter(
          work.id,
          {
            number: workIndex * states.length + chapterIndex + 1,
            title: "Matrix Chapter",
            pages: [{ assetId: pageAssetId }],
          },
          chapterActorId,
        );
        if (workState === "published") {
          fixtureActorIds.push(
            await prepareWorkForPublication(database, work.id),
          );
        }
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
  it("projects all six types and restricts stories without private identifiers", async () => {
    const types = [
      "manga",
      "manhwa",
      "manhua",
      "comics",
      "novel",
      "text-story",
    ] as const;
    for (const type of types) await createCatalogWork(`Saved ${type}`, type);
    const result = await publicContent.listCatalogWorks(
      catalogWorkListQuerySchema.parse({}),
    );
    expect(result.pagination).toEqual({
      page: 1,
      limit: 12,
      total: 6,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    });
    expect(result.items.map((work) => work.type).sort()).toEqual(
      [...types].sort(),
    );
    result.items.forEach((work) => {
      expect(catalogWorkSchema.parse(work)).toEqual(work);
    });
    expect(
      (
        await publicContent.listCatalogWorks(
          catalogWorkListQuerySchema.parse({ view: "stories" }),
        )
      ).items
        .map((work) => work.type)
        .sort(),
    ).toEqual(["novel", "text-story"]);
    const alt = result.items.find((work) => work.type === "novel");
    expect(alt?.alternativeTitle).toBeNull();
  });

  it("intersects alternative-title search, category, type and status with literal wildcard characters", async () => {
    const category = await new CategoryManagementService(
      database,
    ).createCategory({ displayName: "Action", slug: "action" });
    const selected = await createCatalogWork(
      "Selected work",
      "novel",
      category.id,
    );
    await database.work.update({
      where: { id: selected.id },
      data: { alternativeTitle: "Café 100%_Ready", storyStatus: "COMPLETED" },
    });
    await createCatalogWork("Other work", "novel", category.id);
    await createCatalogWork("Café 100%_Ready", "manga");
    const query = {
      q: "CAFÉ 100%_",
      category: "action",
      type: "novel",
      status: "completed",
    };
    expect(
      (
        await publicContent.listCatalogWorks(
          catalogWorkListQuerySchema.parse(query),
        )
      ).items.map((work) => work.slug),
    ).toEqual([selected.slug]);
    for (const overrides of [
      { q: "100xZ" },
      { type: "manga" },
      { status: "ongoing" },
      { category: "unknown-category" },
    ]) {
      expect(
        (
          await publicContent.listCatalogWorks(
            catalogWorkListQuerySchema.parse({ ...query, ...overrides }),
          )
        ).pagination.total,
      ).toBe(0);
    }
    const disabled = await new CategoryManagementService(
      database,
    ).createCategory({ displayName: "Disabled", slug: "disabled" });
    await database.workCategory.create({
      data: { workId: selected.id, categoryId: disabled.id },
    });
    await new CategoryManagementService(database).updateCategory(disabled.id, {
      expectedVersion: disabled.version,
      enabled: false,
    });
    expect(
      (
        await publicContent.listCatalogWorks(
          catalogWorkListQuerySchema.parse({ category: "disabled" }),
        )
      ).items,
    ).toEqual([]);
    expect(
      (
        await publicContent.listCatalogWorks(
          catalogWorkListQuerySchema.parse({
            type: "novel",
            status: "completed",
          }),
        )
      ).items[0]?.categories,
    ).toEqual([{ slug: "action", displayName: "Action" }]);
  });

  it("keeps deterministic publication/title ties, distinct bounded pages and truthful overruns", async () => {
    const records: Awaited<ReturnType<typeof createCatalogWork>>[] = [];
    for (let index = 0; index < 14; index++)
      records.push(await createCatalogWork("Same title"));
    const expected = records
      .map((work) => work.id)
      .sort()
      .map((id) => records.find((work) => work.id === id)?.slug);
    for (const sort of [
      "newest",
      "title-asc",
      "title-desc",
      "chapter-latest",
    ] as const) {
      const first = await publicContent.listCatalogWorks(
        catalogWorkListQuerySchema.parse({ sort }),
      );
      const second = await publicContent.listCatalogWorks(
        catalogWorkListQuerySchema.parse({ sort, page: "2" }),
      );
      expect(
        [...first.items, ...second.items].map((work) => work.slug),
      ).toEqual(expected);
      expect(first.pagination).toEqual({
        page: 1,
        limit: 12,
        total: 14,
        totalPages: 2,
        hasNextPage: true,
        hasPreviousPage: false,
      });
      expect(second.items).toHaveLength(2);
    }
    expect(
      await publicContent.listCatalogWorks(
        catalogWorkListQuerySchema.parse({ page: "3" }),
      ),
    ).toMatchObject({
      items: [],
      pagination: {
        page: 3,
        total: 14,
        totalPages: 2,
        hasNextPage: false,
        hasPreviousPage: true,
      },
    });
    expect(
      await publicContent.listCatalogWorks(
        catalogWorkListQuerySchema.parse({ q: "missing" }),
      ),
    ).toMatchObject({ items: [], pagination: { total: 0, totalPages: 0 } });
  });

  it("orders chapter-latest by eligible publication, placing chapterless works last", async () => {
    const older = await createCatalogWork("Zulu", "novel");
    const newer = await createCatalogWork("Alpha", "novel");
    const chapterless = await createCatalogWork("Middle", "novel");
    for (const [index, work] of [older, newer].entries()) {
      const chapter = await chapters.createChapter(
        work.id,
        {
          number: 1,
          title: "Saved chapter",
          textContent: {
            version: 1,
            blocks: [{ type: "heading", level: 2, text: "Ready" }],
          },
        },
        chapterActorId,
      );
      const clock = new PublicationManagementService(database, {
        currentTime: () =>
          new Date(`2026-09-${String(28 + index)}T12:00:00.000Z`),
        createIdentifier: randomUUID,
      });
      await clock.publishChapter(work.id, chapter.id, {
        expectedVersion: 0,
        targetState: "published",
      });
    }
    const hiddenChapter = await chapters.createChapter(
      chapterless.id,
      {
        number: 1,
        title: "Draft",
        textContent: {
          version: 1,
          blocks: [{ type: "heading", level: 2, text: "Not published" }],
        },
      },
      chapterActorId,
    );
    expect(hiddenChapter.publicationStatus).toBe("draft");
    const slugs = async (sort: string) =>
      (
        await publicContent.listCatalogWorks(
          catalogWorkListQuerySchema.parse({ sort }),
        )
      ).items.map((work) => work.slug);
    expect(await slugs("chapter-latest")).toEqual([
      newer.slug,
      older.slug,
      chapterless.slug,
    ]);
    expect(await slugs("title-asc")).toEqual([
      newer.slug,
      chapterless.slug,
      older.slug,
    ]);
    expect(await slugs("title-desc")).toEqual([
      older.slug,
      chapterless.slug,
      newer.slug,
    ]);
  });

  it("lists only enabled categories in saved order, with bounded name search and pagination", async () => {
    const manager = new CategoryManagementService(database);
    const records = [];
    for (let index = 0; index < 26; index++)
      records.push(
        await manager.createCategory({
          displayName:
            index === 25 ? "Café 100%_" : `Category ${String(index)}`,
          slug: `category-${String(index)}`,
        }),
      );
    const first = records[0];
    if (first === undefined) throw new Error("Missing fixture");
    await manager.updateCategory(first.id, {
      expectedVersion: first.version,
      enabled: false,
    });
    const page1 = await publicContent.listCatalogCategories(
      catalogCategoryListQuerySchema.parse({}),
    );
    const page2 = await publicContent.listCatalogCategories(
      catalogCategoryListQuerySchema.parse({ page: "2" }),
    );
    expect(
      [...page1.items, ...page2.items].map((category) => category.slug),
    ).toEqual(records.slice(1).map((category) => category.slug));
    expect(page1.pagination).toMatchObject({
      limit: 24,
      total: 25,
      totalPages: 2,
    });
    expect(page2.items).toHaveLength(1);
    expect(
      (
        await publicContent.listCatalogCategories(
          catalogCategoryListQuerySchema.parse({ q: "CAFÉ 100%_" }),
        )
      ).items,
    ).toEqual([{ slug: "category-25", displayName: "Café 100%_" }]);
    expect(
      (
        await publicContent.listCatalogCategories(
          catalogCategoryListQuerySchema.parse({ q: "100xZ" }),
        )
      ).items,
    ).toEqual([]);
    expect(
      (
        await publicContent.listCatalogCategories(
          catalogCategoryListQuerySchema.parse({ page: "3" }),
        )
      ).items,
    ).toEqual([]);
  });

  it.each(["publication", "category"] as const)(
    "keeps item/total eligibility in one snapshot across a concurrent %s transition",
    async (transition) => {
      const manager = new CategoryManagementService(database);
      const category = await manager.createCategory({
        displayName: "Primary",
        slug: "primary",
      });
      const fallback = await manager.createCategory({
        displayName: "Fallback",
        slug: "fallback",
      });
      const work = await createCatalogWork(
        "Snapshot work",
        "novel",
        category.id,
      );
      await database.workCategory.create({
        data: { workId: work.id, categoryId: fallback.id },
      });
      const { reader, started, release } = observeSnapshot();
      const input = catalogWorkListQuerySchema.parse({ category: "primary" });
      const inFlight = reader.listCatalogWorks(input);
      await started;
      try {
        if (transition === "publication")
          await publications.publishWork(work.id, {
            expectedVersion: work.version,
            targetState: "draft",
          });
        else
          await manager.updateCategory(category.id, {
            expectedVersion: category.version,
            enabled: false,
          });
      } finally {
        release();
      }
      expect(await inFlight).toMatchObject({
        items: [{ slug: work.slug }],
        pagination: { total: 1 },
      });
      expect(await publicContent.listCatalogWorks(input)).toMatchObject({
        items: [],
        pagination: { total: 0 },
      });
    },
  );
  it("builds bounded saved-order home sections and the first three populated suggestion tabs", async () => {
    const manager = new CategoryManagementService(database);
    const categoryRecords = [];
    for (const slug of [
      "empty",
      "action",
      "drama",
      "disabled",
      "fantasy",
      "fourth",
    ])
      categoryRecords.push(
        await manager.createCategory({ displayName: slug, slug }),
      );
    const [empty, action, drama, disabled, fantasy, fourth] = categoryRecords;
    if (
      empty === undefined ||
      action === undefined ||
      drama === undefined ||
      disabled === undefined ||
      fantasy === undefined ||
      fourth === undefined
    )
      throw new Error("Incomplete home fixture");
    await manager.updateCategory(disabled.id, {
      expectedVersion: disabled.version,
      enabled: false,
    });
    const shared = await createCatalogWork("Shared", "novel", action.id);
    await database.workCategory.create({
      data: { workId: shared.id, categoryId: drama.id },
    });
    const fantasyWork = await createCatalogWork("Fantasy", "novel", fantasy.id);
    await createCatalogWork("Fourth", "novel", fourth.id);
    const actionWorks = [shared];
    for (let index = 0; index < 6; index++)
      actionWorks.push(
        await createCatalogWork(`Action ${String(index)}`, "novel", action.id),
      );
    await works.updateWork(shared.id, {
      expectedVersion: shared.version,
      featuredHome: true,
      featuredOrder: 2,
    });
    await works.updateWork(fantasyWork.id, {
      expectedVersion: fantasyWork.version,
      featuredHome: true,
      featuredOrder: 1,
    });
    const chapter = await chapters.createChapter(
      shared.id,
      {
        number: 1,
        title: "Latest saved chapter",
        textContent: {
          version: 1,
          blocks: [{ type: "heading", level: 2, text: "Ready" }],
        },
      },
      chapterActorId,
    );
    await publications.publishChapter(shared.id, chapter.id, {
      expectedVersion: 0,
      targetState: "published",
    });
    const before = {
      publications: await database.publicationEvent.count(),
      references: await database.mediaReferenceEvent.count(),
    };
    const home = await publicContent.getCatalogHome();
    expect(home.featured.map((work) => work.slug)).toEqual([
      fantasyWork.slug,
      shared.slug,
    ]);
    expect(home.categoryShortcuts.map((category) => category.slug)).toEqual([
      "empty",
      "action",
      "drama",
      "fantasy",
      "fourth",
    ]);
    expect(home.suggestions.map((tab) => tab.category.slug)).toEqual([
      "action",
      "drama",
      "fantasy",
    ]);
    expect(home.suggestions[0]?.works.map((work) => work.slug)).toEqual(
      actionWorks
        .toSorted((a, b) => a.id.localeCompare(b.id))
        .slice(0, 6)
        .map((work) => work.slug),
    );
    expect(home.suggestions[1]?.works.map((work) => work.slug)).toEqual([
      shared.slug,
    ]);
    expect(home.latestReleases).toMatchObject([
      {
        work: { slug: shared.slug },
        chapter: { number: 1, title: "Latest saved chapter" },
      },
    ]);
    expect(await database.publicationEvent.count()).toBe(before.publications);
    expect(await database.mediaReferenceEvent.count()).toBe(before.references);
    for (const work of actionWorks)
      if (work.id !== shared.id)
        await database.workCategory.create({
          data: { workId: work.id, categoryId: fourth.id },
        });
    const permitted = await manager.updateCategory(action.id, {
      expectedVersion: action.version,
      enabled: false,
    });
    expect(permitted.enabled).toBe(false);
    expect(
      (await publicContent.getCatalogHome()).suggestions.map(
        (tab) => tab.category.slug,
      ),
    ).toEqual(["drama", "fantasy", "fourth"]);
    await expect(
      manager.updateCategory(drama.id, {
        expectedVersion: drama.version,
        enabled: false,
      }),
    ).rejects.toMatchObject({ code: "CONTENT_CATEGORY_IN_USE" });
    expect(
      (await publicContent.getCatalogHome()).featured.map((work) => work.slug),
    ).toContain(shared.slug);
  });

  it("returns genuinely empty home sections and excludes withdrawn work and chapter releases", async () => {
    expect(await publicContent.getCatalogHome()).toEqual({
      featured: [],
      categoryShortcuts: [],
      latestReleases: [],
      suggestions: [],
    });
    const work = await createCatalogWork("Withdrawn home", "novel");
    const chapter = await chapters.createChapter(
      work.id,
      {
        number: 1,
        title: "Saved",
        textContent: {
          version: 1,
          blocks: [{ type: "heading", level: 2, text: "Ready" }],
        },
      },
      chapterActorId,
    );
    const published = await publications.publishChapter(work.id, chapter.id, {
      expectedVersion: 0,
      targetState: "published",
    });
    expect((await publicContent.getCatalogHome()).latestReleases).toHaveLength(
      1,
    );
    await publications.publishChapter(work.id, chapter.id, {
      expectedVersion: published.version,
      targetState: "draft",
    });
    expect((await publicContent.getCatalogHome()).latestReleases).toEqual([]);
    await publications.publishWork(work.id, {
      expectedVersion: work.version,
      targetState: "draft",
    });
    expect((await publicContent.getCatalogHome()).suggestions).toEqual([]);
  });
  it("bounds and orders latest releases across the full eligible Chapter set", async () => {
    const work = await createCatalogWork("Release ordering", "novel");
    for (let number = 1; number <= 13; number++) {
      const chapter = await chapters.createChapter(
        work.id,
        {
          number,
          title: `Chapter ${String(number)}`,
          textContent: {
            version: 1,
            blocks: [{ type: "heading", level: 2, text: "Ready" }],
          },
        },
        chapterActorId,
      );
      const publisher = new PublicationManagementService(database, {
        currentTime: () => new Date(Date.UTC(2026, 8, 27, 12, number)),
        createIdentifier: randomUUID,
      });
      await publisher.publishChapter(work.id, chapter.id, {
        expectedVersion: 0,
        targetState: "published",
      });
    }
    expect(
      (await publicContent.getCatalogHome()).latestReleases.map(
        (release) => release.chapter.number,
      ),
    ).toEqual([13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2]);
  });

  it("keeps composite home selections in one snapshot during Work withdrawal", async () => {
    const work = await createCatalogWork("Home snapshot", "novel");
    const featured = await works.updateWork(work.id, {
      expectedVersion: work.version,
      featuredHome: true,
      featuredOrder: 1,
    });
    const { reader, started, release } = observeSnapshot();
    const inFlight = reader.getCatalogHome();
    await started;
    try {
      await publications.publishWork(work.id, {
        expectedVersion: featured.version,
        targetState: "draft",
      });
    } finally {
      release();
    }
    expect(await inFlight).toMatchObject({
      featured: [{ slug: work.slug }],
      suggestions: [{ works: [{ slug: work.slug }] }],
    });
    expect(await publicContent.getCatalogHome()).toMatchObject({
      featured: [],
      latestReleases: [],
      suggestions: [],
    });
  });
  it("projects optional detail, enabled saved categories/tags, full-set chapter boundaries and similar Works", async () => {
    const manager = new CategoryManagementService(database);
    const primary = await manager.createCategory({
      displayName: "Action",
      slug: "detail-action",
    });
    const other = await manager.createCategory({
      displayName: "Other",
      slug: "detail-other",
    });
    const work = await createCatalogWork("Detail", "novel", primary.id);
    const related = await createCatalogWork("Related", "novel", primary.id);
    await database.workCategory.create({
      data: { workId: work.id, categoryId: other.id },
    });
    await database.workCategory.create({
      data: { workId: related.id, categoryId: other.id },
    });
    await works.updateWork(work.id, {
      expectedVersion: work.version,
      tags: ["Second", "First"],
      artist: "Saved Artist",
    });
    const empty = await publicContent.getCatalogDetail(work.slug);
    expect(empty).toMatchObject({
      work: {
        slug: work.slug,
        artist: "Saved Artist",
        tags: ["Second", "First"],
        backgroundPath: null,
      },
      chapters: { items: [], pagination: { total: 0 } },
      firstChapter: null,
      latestChapter: null,
    });
    expect(empty.similar.map((item) => item.slug)).toEqual([related.slug]);
    for (let number = 2; number <= 28; number++) {
      const chapter = await chapters.createChapter(
        work.id,
        {
          number,
          title: `Saved ${String(number)}`,
          textContent: {
            version: 1,
            blocks: [{ type: "heading", level: 2, text: "Ready" }],
          },
        },
        chapterActorId,
      );
      await publications.publishChapter(work.id, chapter.id, {
        expectedVersion: 0,
        targetState: "published",
      });
    }
    const detail = await publicContent.getCatalogDetail(work.slug);
    expect(detail.chapters.items).toHaveLength(25);
    expect(detail.chapters.pagination).toMatchObject({
      total: 27,
      totalPages: 2,
      limit: 25,
    });
    expect(detail.firstChapter?.number).toBe(2);
    expect(detail.latestChapter?.number).toBe(28);
    expect(detail.chapters.items.at(-1)?.number).toBe(26);
    expect(detail.work.categories.map((category) => category.slug)).toEqual([
      primary.slug,
      other.slug,
    ]);
    const disabled = await manager.updateCategory(primary.id, {
      expectedVersion: primary.version,
      enabled: false,
    });
    expect(disabled.enabled).toBe(false);
    expect(
      (await publicContent.getCatalogDetail(work.slug)).work.categories.map(
        (category) => category.slug,
      ),
    ).toEqual([other.slug]);
    const chapter = await publicContent.getChapter(work.slug, 28);
    const stored = await database.chapter.findUniqueOrThrow({
      where: { id: chapter.id },
    });
    await publications.publishChapter(work.id, chapter.id, {
      expectedVersion: stored.version,
      targetState: "draft",
    });
    expect(
      (await publicContent.getCatalogDetail(work.slug)).latestChapter?.number,
    ).toBe(27);
  });

  it.each(["work", "chapter"] as const)(
    "keeps detail coherent while a %s is unpublished",
    async (transition) => {
      const work = await createCatalogWork("Detail snapshot", "novel");
      const chapter = await chapters.createChapter(
        work.id,
        {
          number: 1,
          title: "Saved",
          textContent: {
            version: 1,
            blocks: [{ type: "heading", level: 2, text: "Ready" }],
          },
        },
        chapterActorId,
      );
      const published = await publications.publishChapter(work.id, chapter.id, {
        expectedVersion: 0,
        targetState: "published",
      });
      const { reader, started, release } = observeSnapshot();
      const inFlight = reader.getCatalogDetail(work.slug);
      await started;
      try {
        if (transition === "work")
          await publications.publishWork(work.id, {
            expectedVersion: work.version,
            targetState: "draft",
          });
        else
          await publications.publishChapter(work.id, chapter.id, {
            expectedVersion: published.version,
            targetState: "draft",
          });
      } finally {
        release();
      }
      expect(await inFlight).toMatchObject({
        work: { slug: work.slug },
        chapters: { items: [{ number: 1 }], pagination: { total: 1 } },
        firstChapter: { number: 1 },
        latestChapter: { number: 1 },
      });
      if (transition === "work")
        await expect(
          publicContent.getCatalogDetail(work.slug),
        ).rejects.toMatchObject({ statusCode: 404 });
      else
        expect(await publicContent.getCatalogDetail(work.slug)).toMatchObject({
          chapters: { items: [], pagination: { total: 0 } },
          firstChapter: null,
          latestChapter: null,
        });
    },
  );
  it("exports all eligible canonical slugs across bounded batches without private IDs or writes", async () => {
    expect(await publicContent.getCatalogSitemap()).toEqual({ items: [] });
    const manager = new CategoryManagementService(database);
    const category = await manager.createCategory({
      displayName: "Sitemap",
      slug: "sitemap",
    });
    const saved = [];
    for (let index = 0; index < 103; index++)
      saved.push(
        await createCatalogWork(
          `Sitemap ${String(index)}`,
          "novel",
          category.id,
        ),
      );
    const withdrawn = saved.at(-1);
    if (withdrawn === undefined) throw new Error("Missing sitemap fixture");
    await publications.publishWork(withdrawn.id, {
      expectedVersion: withdrawn.version,
      targetState: "draft",
    });
    const before = {
      publications: await database.publicationEvent.count(),
      references: await database.mediaReferenceEvent.count(),
    };
    const output = await publicContent.getCatalogSitemap();
    expect(output).toEqual({
      items: saved
        .filter((work) => work.id !== withdrawn.id)
        .toSorted((a, b) => a.id.localeCompare(b.id))
        .map((work) => ({ slug: work.slug })),
    });
    expect(output.items).toHaveLength(102);
    expect(await database.publicationEvent.count()).toBe(before.publications);
    expect(await database.mediaReferenceEvent.count()).toBe(before.references);
    const secondBatchWork = saved
      .filter((work) => work.id !== withdrawn.id)
      .toSorted((a, b) => a.id.localeCompare(b.id))
      .at(-1);
    if (secondBatchWork === undefined)
      throw new Error("Missing second batch Work");
    const { reader, started, release, querySizes } = observeSnapshot();
    const inFlight = reader.getCatalogSitemap();
    await started;
    try {
      await publications.publishWork(secondBatchWork.id, {
        expectedVersion: secondBatchWork.version,
        targetState: "draft",
      });
    } finally {
      release();
    }
    expect(await inFlight).toEqual(output);
    expect(querySizes).toEqual([100, 2]);
    const fresh = await publicContent.getCatalogSitemap();
    expect(fresh.items).toHaveLength(101);
    expect(fresh.items.map((work) => work.slug)).not.toContain(
      secondBatchWork.slug,
    );
  });

  it("keeps sitemap visibility in one snapshot during publication changes", async () => {
    const work = await createCatalogWork("Sitemap snapshot", "novel");
    const { reader, started, release } = observeSnapshot();
    const inFlight = reader.getCatalogSitemap();
    await started;
    try {
      await publications.publishWork(work.id, {
        expectedVersion: work.version,
        targetState: "draft",
      });
    } finally {
      release();
    }
    expect(await inFlight).toEqual({ items: [{ slug: work.slug }] });
    expect(await publicContent.getCatalogSitemap()).toEqual({ items: [] });
  });
});
