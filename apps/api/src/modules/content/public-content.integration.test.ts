import { createDatabaseClient } from "@fury/database";
import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";

import { NotFoundException } from "../../core/errors/not-found.error.js";
import type { PublicationStatus } from "@fury/contracts";
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
});
