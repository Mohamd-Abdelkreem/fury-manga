import { randomUUID } from "node:crypto";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import sharp from "sharp";
import { afterAll, beforeEach, describe, expect, it } from "vitest";

import type { AdminWorkListQuery, CreateWorkBody } from "@fury/contracts";
import {
  ChapterContentType,
  createDatabaseClient,
  UserRole,
  UserStatus,
} from "@fury/database";

import { createMediaConfig } from "../../core/config/media.config.js";
import { MediaStorage } from "../../infrastructure/media/media-storage.js";
import { CategoryManagementService } from "./category-management.service.js";
import { ContentConflictException } from "./content.errors.js";
import { WorkManagementService } from "./work-management.service.js";
import { PublicContentService } from "./public-content.service.js";
import { MediaService } from "../media/media.service.js";

const databaseUrl = process.env["DATABASE_URL"];
if (databaseUrl === undefined) {
  throw new Error("The Testcontainers DATABASE_URL was not provided.");
}

const database = createDatabaseClient(databaseUrl);
const fixtureRoot = mkdtempSync(join(tmpdir(), "fury-work-management-"));
const mediaRoot = join(fixtureRoot, "private-media");
mkdirSync(mediaRoot);
const mediaStorage = new MediaStorage(createMediaConfig(mediaRoot));
const media = new MediaService(database, mediaStorage);
const works = new WorkManagementService(database, media);
const publicContent = new PublicContentService(database);
const categories = new CategoryManagementService(database);
const adminIds: string[] = [];

const createAdmin = async (): Promise<string> => {
  const id = randomUUID();
  await database.user.create({
    data: {
      id,
      email: `work-admin-${id}@example.test`,
      fullName: "Work Admin",
      passwordHash: "test-hash",
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      emailVerifiedAt: new Date(),
    },
  });
  adminIds.push(id);
  return id;
};

const uploadAsset = async (
  actorUserId: string,
  mediaClass: "work_cover" | "work_background",
): Promise<string> => {
  const uploaded = await media.uploadAdmin({
    actorUserId,
    attemptId: randomUUID(),
    mediaClass,
    source: await sharp({
      create: {
        width: mediaClass === "work_cover" ? 600 : 1_200,
        height: mediaClass === "work_cover" ? 800 : 675,
        channels: 3,
        background: mediaClass === "work_cover" ? "orange" : "navy",
      },
    })
      .jpeg()
      .toBuffer(),
    declaredType: "image/jpeg",
    sourceName: `${mediaClass}.jpg`,
  });
  return uploaded.asset.id;
};

const uniqueWorkBody = (
  overrides: Partial<CreateWorkBody> = {},
): CreateWorkBody => ({
  title: "Service work",
  slug: `service-work-${randomUUID()}`,
  type: "manga",
  storyStatus: "ongoing",
  ...overrides,
});

beforeEach(async () => {
  await database.$executeRawUnsafe(
    "TRUNCATE media_reference_events, media_references, upload_attempts, media_assets, publication_events, chapter_pages, chapters, work_tags, work_categories, categories, works",
  );
});

afterAll(async () => {
  await database.$executeRawUnsafe(
    "TRUNCATE media_reference_events, media_references, upload_attempts, media_assets, publication_events, chapter_pages, chapters, work_tags, work_categories, categories, works",
  );
  await database.user.deleteMany({ where: { id: { in: adminIds } } });
  await database.$disconnect();
  rmSync(fixtureRoot, { recursive: true, force: true });
});

describe("complete Work draft management with PostgreSQL", () => {
  it("filters saved Works and counts chapters with stable database pages", async () => {
    const first = await works.createWork(
      uniqueWorkBody({
        title: "Atlas",
        alternativeTitle: "North",
        type: "manga",
      }),
    );
    const second = await works.createWork(
      uniqueWorkBody({
        title: "Beta",
        alternativeTitle: "Atlas Two",
        type: "manga",
      }),
    );
    const novel = await works.createWork(
      uniqueWorkBody({ title: "Atlas Novel", type: "novel" }),
    );
    await database.work.update({
      where: { id: first.id },
      data: {
        createdAt: new Date("2026-01-01T00:00:00.000Z"),
        updatedAt: new Date("2026-03-01T00:00:00.000Z"),
      },
    });
    await database.work.update({
      where: { id: second.id },
      data: {
        createdAt: new Date("2026-02-01T00:00:00.000Z"),
        updatedAt: new Date("2026-02-01T00:00:00.000Z"),
      },
    });
    await database.work.update({
      where: { id: novel.id },
      data: { publicationStatus: "ARCHIVED" },
    });
    await database.chapter.create({
      data: {
        workId: second.id,
        number: 1,
        contentType: ChapterContentType.ILLUSTRATED,
      },
    });
    const pagination = { page: 1, limit: 1, skip: 0, take: 1 };
    const query: AdminWorkListQuery = {
      page: 1,
      limit: 1,
      search: "atlas",
      type: "manga",
      sort: "chapters",
    };
    const firstPage = await works.listWorks(pagination, query);
    expect(firstPage.pagination.total).toBe(2);
    expect(firstPage.items).toMatchObject([{ id: second.id, chapterCount: 1 }]);
    const secondPage = await works.listWorks(
      { ...pagination, page: 2, skip: 1 },
      { ...query, page: 2 },
    );
    expect(secondPage.items).toMatchObject([{ id: first.id, chapterCount: 0 }]);
    expect(secondPage.pagination.total).toBe(2);
    expect(Object.keys(firstPage.items[0] ?? {})).not.toContain("synopsis");
    for (const [sort, expectedId] of [
      ["updated", first.id],
      ["oldest", first.id],
      ["title", first.id],
      ["chapters", second.id],
    ] as const) {
      const sorted = await works.listWorks(pagination, { ...query, sort });
      expect(sorted.items[0]?.id).toBe(expectedId);
    }
    const archived = await works.listWorks(pagination, {
      page: 1,
      limit: 1,
      sort: "updated",
      publicationStatus: "archived",
      type: "novel",
    });
    expect(archived.pagination.total).toBe(1);
    expect(archived.items[0]?.id).toBe(novel.id);
  });
  it("publishes a complete create atomically and retains one event", async () => {
    const actorUserId = await createAdmin();
    const category = await categories.createCategory({
      displayName: "Ready",
      slug: `ready-${randomUUID()}`,
    });
    const coverAssetId = await uploadAsset(actorUserId, "work_cover");
    const work = await works.createWork(
      uniqueWorkBody({
        synopsis: "A complete synopsis for publication and recovery.",
        author: "Author",
        categoryIds: [category.id],
        coverAssetId,
        targetState: "published",
      }),
      actorUserId,
    );
    expect(work).toMatchObject({
      publicationStatus: "published",
      coverAssetId,
    });
    expect(work.publishedAt).not.toBeNull();
    expect(
      await database.publicationEvent.count({ where: { workId: work.id } }),
    ).toBe(1);
  });

  it("leaves no draft or submitted association after incomplete create-publish", async () => {
    const actorUserId = await createAdmin();
    const id = randomUUID();
    await expect(
      works.createWork(
        uniqueWorkBody({ id, targetState: "published" }),
        actorUserId,
      ),
    ).rejects.toMatchObject({ code: "CONTENT_NOT_READY", statusCode: 409 });
    expect(await database.work.findUnique({ where: { id } })).toBeNull();
    expect(
      await database.publicationEvent.count({ where: { workId: id } }),
    ).toBe(0);
  });

  it("rejects direct retirement of a published cover and advances the parent on replacement", async () => {
    const actorUserId = await createAdmin();
    const category = await categories.createCategory({
      displayName: "Cover",
      slug: `cover-${randomUUID()}`,
    });
    const firstCover = await uploadAsset(actorUserId, "work_cover");
    const secondCover = await uploadAsset(actorUserId, "work_cover");
    const published = await works.createWork(
      uniqueWorkBody({
        synopsis: "A complete synopsis for a published cover replacement.",
        author: "Author",
        categoryIds: [category.id],
        coverAssetId: firstCover,
        targetState: "published",
      }),
      actorUserId,
    );
    const reference = await database.mediaReference.findFirstOrThrow({
      where: { workId: published.id, slot: "WORK_COVER", retiredAt: null },
    });
    await expect(
      media.retireReference(actorUserId, reference.id, {
        expectedAssetId: firstCover,
        expectedVersion: reference.version,
      }),
    ).rejects.toMatchObject({ code: "CONTENT_NOT_READY", statusCode: 409 });
    expect(
      await database.mediaReferenceEvent.count({
        where: { referenceId: reference.id },
      }),
    ).toBe(1);
    await media.replaceReference(actorUserId, reference.id, {
      assetId: secondCover,
      expectedAssetId: firstCover,
      expectedVersion: reference.version,
    });
    expect(await works.getWork(published.id)).toMatchObject({
      coverAssetId: secondCover,
      version: published.version + 1,
    });
  });

  it("removes unavailable-cover metadata from public detail and total without losing admin history", async () => {
    const actorUserId = await createAdmin();
    const category = await categories.createCategory({
      displayName: "Visible",
      slug: `visible-${randomUUID()}`,
    });
    const coverAssetId = await uploadAsset(actorUserId, "work_cover");
    const published = await works.createWork(
      uniqueWorkBody({
        synopsis: "A complete synopsis for fail closed public metadata.",
        author: "Author",
        categoryIds: [category.id],
        coverAssetId,
        targetState: "published",
      }),
      actorUserId,
    );
    const pagination = { page: 1, limit: 25, skip: 0, take: 25 };
    expect((await publicContent.listWorks(pagination)).pagination.total).toBe(
      1,
    );
    await database.mediaAsset.update({
      where: { id: coverAssetId },
      data: { status: "UNAVAILABLE" },
    });
    await expect(publicContent.getWork(published.slug)).rejects.toMatchObject({
      statusCode: 404,
    });
    expect((await publicContent.listWorks(pagination)).pagination.total).toBe(
      0,
    );
    expect(await works.getWork(published.id)).toMatchObject({
      publicationStatus: "published",
    });
    expect(
      await database.publicationEvent.count({
        where: { workId: published.id },
      }),
    ).toBe(1);
  });

  it("rejects a competing published featured position without creating the losing Work", async () => {
    const actorUserId = await createAdmin();
    const category = await categories.createCategory({
      displayName: "Featured",
      slug: `featured-${randomUUID()}`,
    });
    const firstCover = await uploadAsset(actorUserId, "work_cover");
    const secondCover = await uploadAsset(actorUserId, "work_cover");
    const base = {
      synopsis: "A complete synopsis for featured publication.",
      author: "Author",
      categoryIds: [category.id],
      featuredHome: true,
      featuredOrder: 7,
      targetState: "published" as const,
    };
    await works.createWork(
      uniqueWorkBody({ ...base, coverAssetId: firstCover }),
      actorUserId,
    );
    expect(
      await database.work.count({
        where: { publicationStatus: "PUBLISHED", featuredOrder: 7 },
      }),
    ).toBe(1);
    const losingId = randomUUID();
    await expect(
      works.createWork(
        uniqueWorkBody({
          ...base,
          id: losingId,
          coverAssetId: secondCover,
        }),
        actorUserId,
      ),
    ).rejects.toMatchObject({
      code: "CONTENT_FEATURED_CONFLICT",
      statusCode: 409,
    });
    expect(
      await database.work.findUnique({ where: { id: losingId } }),
    ).toBeNull();
  });
  it("rolls back early editorial and cover writes when a combined PATCH loses featured placement", async () => {
    const actorUserId = await createAdmin();
    const category = await categories.createCategory({
      displayName: "Atomic",
      slug: `atomic-${randomUUID()}`,
    });
    const winnerCover = await uploadAsset(actorUserId, "work_cover");
    const losingCover = await uploadAsset(actorUserId, "work_cover");
    await works.createWork(
      uniqueWorkBody({
        synopsis: "A complete synopsis for a featured winner Work.",
        author: "Author",
        categoryIds: [category.id],
        coverAssetId: winnerCover,
        featuredHome: true,
        featuredOrder: 9,
        targetState: "published",
      }),
      actorUserId,
    );
    const draft = await works.createWork(uniqueWorkBody(), actorUserId);
    await expect(
      works.updateWork(
        draft.id,
        {
          expectedVersion: draft.version,
          title: "Uncommitted title",
          tags: ["atomic"],
          synopsis: "A complete synopsis for losing featured placement.",
          author: "Author",
          categoryIds: [category.id],
          coverAssetId: losingCover,
          featuredHome: true,
          featuredOrder: 9,
          targetState: "published",
        },
        actorUserId,
      ),
    ).rejects.toMatchObject({ code: "CONTENT_FEATURED_CONFLICT" });
    expect(await works.getWork(draft.id)).toMatchObject({
      publicationStatus: "draft",
      title: draft.title,
      version: draft.version,
      coverAssetId: null,
    });
    expect(
      await database.workCategory.count({ where: { workId: draft.id } }),
    ).toBe(0);
    expect(await database.workTag.count({ where: { workId: draft.id } })).toBe(
      0,
    );
    expect(
      await database.mediaReference.count({ where: { workId: draft.id } }),
    ).toBe(0);
    expect(
      await database.publicationEvent.count({ where: { workId: draft.id } }),
    ).toBe(0);
  });
  it("admits only one simultaneous featured publication for a position", async () => {
    const actorUserId = await createAdmin();
    const category = await categories.createCategory({
      displayName: "Racing",
      slug: `racing-${randomUUID()}`,
    });
    const covers = await Promise.all([
      uploadAsset(actorUserId, "work_cover"),
      uploadAsset(actorUserId, "work_cover"),
    ]);
    const commands = covers.map((coverAssetId) =>
      uniqueWorkBody({
        synopsis: "A complete synopsis for concurrent featured placement.",
        author: "Author",
        categoryIds: [category.id],
        coverAssetId,
        featuredHome: true,
        featuredOrder: 12,
        targetState: "published",
      }),
    );
    const outcomes = await Promise.allSettled(
      commands.map((command) => works.createWork(command, actorUserId)),
    );
    expect(
      outcomes.filter((outcome) => outcome.status === "fulfilled"),
    ).toHaveLength(1);
    const loser = outcomes.find((outcome) => outcome.status === "rejected");
    expect(loser).toMatchObject({
      status: "rejected",
      reason: { statusCode: 409 },
    });
    expect(
      await database.work.count({
        where: { publicationStatus: "PUBLISHED", featuredOrder: 12 },
      }),
    ).toBe(1);
    expect(await database.publicationEvent.count()).toBe(1);
  });
  it("persists both Work types, all editorial values, enabled categories, featured preference, tags, and media history", async () => {
    const actorUserId = await createAdmin();
    const category = await categories.createCategory({
      displayName: "Adventure",
      slug: `adventure-${randomUUID()}`,
    });
    const mangaCover = await uploadAsset(actorUserId, "work_cover");
    const mangaBackground = await uploadAsset(actorUserId, "work_background");
    const storyCover = await uploadAsset(actorUserId, "work_cover");
    const mangaId = randomUUID();

    const manga = await works.createWork(
      uniqueWorkBody({
        id: mangaId,
        title: "Illustrated draft",
        alternativeTitle: "Alternate name",
        synopsis: "A complete illustrated synopsis with enough detail.",
        author: "Author One",
        artist: "Artist One",
        categoryIds: [category.id],
        tags: ["Adventure", "Mystery"],
        coverAssetId: mangaCover,
        backgroundAssetId: mangaBackground,
        featuredHome: true,
        featuredOrder: 4,
      }),
      actorUserId,
    );
    const textStory = await works.createWork(
      uniqueWorkBody({
        title: "Text draft",
        type: "text-story",
        categoryIds: [category.id],
        tags: ["Drama"],
        coverAssetId: storyCover,
      }),
      actorUserId,
    );

    expect(manga).toMatchObject({
      id: mangaId,
      type: "manga",
      alternativeTitle: "Alternate name",
      synopsis: "A complete illustrated synopsis with enough detail.",
      author: "Author One",
      artist: "Artist One",
      featuredHome: true,
      featuredOrder: 4,
      coverAssetId: mangaCover,
      backgroundAssetId: mangaBackground,
      tags: ["Adventure", "Mystery"],
      categories: [{ id: category.id, enabled: true }],
      publicationStatus: "draft",
    });
    expect(textStory).toMatchObject({
      type: "text-story",
      coverAssetId: storyCover,
      backgroundAssetId: null,
      tags: ["Drama"],
      categories: [{ id: category.id }],
      publicationStatus: "draft",
    });
    const events = await database.mediaReferenceEvent.findMany({
      where: { reference: { workId: manga.id } },
      orderBy: [{ referenceId: "asc" }, { resultVersion: "asc" }],
    });
    expect(events).toHaveLength(2);
    expect(events.map(({ action }) => action)).toEqual(["BOUND", "BOUND"]);

    const reconnected = createDatabaseClient(databaseUrl);
    try {
      const saved = await new WorkManagementService(
        reconnected,
        new MediaService(reconnected, mediaStorage),
      ).getWork(manga.id);
      const currentManga = await works.getWork(manga.id);
      expect(saved).toEqual(currentManga);
    } finally {
      await reconnected.$disconnect();
    }
  });

  it("rejects duplicate caller identity and slug instead of interpreting conflict as success", async () => {
    const identity = randomUUID();
    const body = {
      id: identity,
      ...uniqueWorkBody({ title: "Caller identity" }),
    };
    const created = await works.createWork(body);
    await expect(works.createWork(body)).rejects.toBeInstanceOf(
      ContentConflictException,
    );
    await expect(
      works.createWork({
        ...uniqueWorkBody({ title: "Conflicting slug" }),
        slug: created.slug,
      }),
    ).rejects.toBeInstanceOf(ContentConflictException);
    await expect(
      database.work.count({ where: { id: identity } }),
    ).resolves.toBe(1);
  });

  it("retains disabled associations but refuses a newly attached disabled category", async () => {
    const first = await categories.createCategory({
      displayName: "Retained",
      slug: `retained-${randomUUID()}`,
    });
    const second = await categories.createCategory({
      displayName: "Disabled later",
      slug: `disabled-later-${randomUUID()}`,
    });
    const work = await works.createWork({
      ...uniqueWorkBody(),
      categoryIds: [first.id],
    });
    const disabledFirst = await categories.updateCategory(first.id, {
      expectedVersion: first.version,
      enabled: false,
    });

    const retained = await works.updateWork(work.id, {
      expectedVersion: work.version,
      categoryIds: [first.id],
    });
    expect(retained.categories).toMatchObject([
      { id: first.id, enabled: false },
    ]);
    expect(disabledFirst.enabled).toBe(false);

    await categories.updateCategory(second.id, {
      expectedVersion: second.version,
      enabled: false,
    });
    await expect(
      works.updateWork(work.id, {
        expectedVersion: retained.version,
        categoryIds: [first.id, second.id],
      }),
    ).rejects.toMatchObject({ code: "CONTENT_CONFLICT" });
    await expect(
      database.workCategory.findMany({ where: { workId: work.id } }),
    ).resolves.toHaveLength(1);
  });

  it("rejects stale edits and admits one competing version while preserving immutable identity", async () => {
    const work = await works.createWork(uniqueWorkBody());
    const edits = await Promise.allSettled([
      works.updateWork(work.id, {
        expectedVersion: 0,
        title: "First editor",
        slug: work.slug,
        type: work.type,
      }),
      works.updateWork(work.id, {
        expectedVersion: 0,
        title: "Second editor",
        slug: work.slug,
        type: work.type,
      }),
    ]);
    expect(edits.filter(({ status }) => status === "fulfilled")).toHaveLength(
      1,
    );
    expect(edits.filter(({ status }) => status === "rejected")).toHaveLength(1);
    const saved = await works.getWork(work.id);
    expect(saved.version).toBe(1);
    expect(["First editor", "Second editor"]).toContain(saved.title);
    await expect(
      works.updateWork(saved.id, {
        expectedVersion: saved.version,
        slug: "changed-slug",
      }),
    ).rejects.toMatchObject({ code: "CONTENT_IMMUTABLE" });
    await expect(
      works.updateWork(saved.id, {
        expectedVersion: saved.version - 1,
        title: "Stale editor",
      }),
    ).rejects.toMatchObject({ code: "CONTENT_STALE_WRITE" });
  });

  it("rejects an unavailable cover without saving the draft or a reference", async () => {
    const actorUserId = await createAdmin();
    const coverAssetId = await uploadAsset(actorUserId, "work_cover");
    await database.mediaAsset.update({
      where: { id: coverAssetId },
      data: { status: "UNAVAILABLE" },
    });
    const id = randomUUID();
    await expect(
      works.createWork(
        uniqueWorkBody({ id, coverAssetId, tags: ["Never saved"] }),
        actorUserId,
      ),
    ).rejects.toMatchObject({ statusCode: 404, code: "NOT_FOUND" });
    await expect(database.work.count({ where: { id } })).resolves.toBe(0);
    await expect(
      database.mediaReference.count({ where: { workId: id } }),
    ).resolves.toBe(0);
  });

  it("rolls back all draft rows when a media event is written and the collaborator fails", async () => {
    const actorUserId = await createAdmin();
    const coverAssetId = await uploadAsset(actorUserId, "work_cover");
    const category = await categories.createCategory({
      displayName: "Atomic category",
      slug: `atomic-${randomUUID()}`,
    });
    const id = randomUUID();
    const failingWorks = new WorkManagementService(database, {
      saveWorkReferences: async (...args) => {
        await media.saveWorkReferences(...args);
        throw new Error("injected failure after reference event");
      },
    });

    await expect(
      failingWorks.createWork(
        uniqueWorkBody({
          id,
          tags: ["Atomic tag"],
          categoryIds: [category.id],
          coverAssetId,
        }),
        actorUserId,
      ),
    ).rejects.toThrow("injected failure after reference event");
    await expect(database.work.count({ where: { id } })).resolves.toBe(0);
    await expect(
      database.workTag.count({ where: { workId: id } }),
    ).resolves.toBe(0);
    await expect(
      database.workCategory.count({ where: { workId: id } }),
    ).resolves.toBe(0);
    await expect(
      database.mediaReference.count({ where: { workId: id } }),
    ).resolves.toBe(0);
    await expect(
      database.mediaReferenceEvent.count({
        where: { reference: { workId: id } },
      }),
    ).resolves.toBe(0);
    await expect(
      database.publicationEvent.count({ where: { workId: id } }),
    ).resolves.toBe(0);
  });

  it("refuses a published edit that removes required metadata, enabled categories, or its available cover without partial writes", async () => {
    const actorUserId = await createAdmin();
    const category = await categories.createCategory({
      displayName: "Published eligibility",
      slug: `published-eligibility-${randomUUID()}`,
    });
    const coverAssetId = await uploadAsset(actorUserId, "work_cover");
    const work = await works.createWork(
      uniqueWorkBody({
        synopsis: "A sufficiently detailed synopsis for a published work.",
        author: "Published author",
        categoryIds: [category.id],
        coverAssetId,
        tags: ["Original"],
      }),
      actorUserId,
    );
    const { PublicationManagementService } =
      await import("./publication-management.service.js");
    const publication = new PublicationManagementService(database, {
      currentTime: () => new Date(),
      createIdentifier: randomUUID,
    });
    await publication.publishWork(work.id, {
      expectedVersion: work.version,
      targetState: "published",
    });
    const baseline = await works.getWork(work.id);
    const beforeReferences = await database.mediaReference.findMany({
      where: { workId: work.id },
    });
    for (const change of [
      { synopsis: null },
      { author: null },
      { categoryIds: [] },
      { coverAssetId: null },
    ]) {
      await expect(
        works.updateWork(
          work.id,
          {
            expectedVersion: baseline.version,
            title: "Not committed",
            tags: ["Changed"],
            ...change,
          },
          actorUserId,
        ),
      ).rejects.toMatchObject({ statusCode: 409 });
      expect(await works.getWork(work.id)).toEqual(baseline);
      expect(
        await database.mediaReference.findMany({ where: { workId: work.id } }),
      ).toEqual(beforeReferences);
    }
  });

  it("rolls back metadata, tags, categories, references, and history after a failed asset association", async () => {
    const actorUserId = await createAdmin();
    const firstCategory = await categories.createCategory({
      displayName: "First",
      slug: `first-${randomUUID()}`,
    });
    const nextCategory = await categories.createCategory({
      displayName: "Next",
      slug: `next-${randomUUID()}`,
    });
    const work = await works.createWork({
      ...uniqueWorkBody(),
      categoryIds: [firstCategory.id],
      tags: ["Original"],
    });
    const wrongClassAsset = await uploadAsset(actorUserId, "work_background");

    await expect(
      works.updateWork(
        work.id,
        {
          expectedVersion: work.version,
          title: "Must roll back",
          categoryIds: [nextCategory.id],
          tags: ["Changed"],
          coverAssetId: wrongClassAsset,
        },
        actorUserId,
      ),
    ).rejects.toMatchObject({ statusCode: 404, code: "NOT_FOUND" });

    await expect(works.getWork(work.id)).resolves.toMatchObject({
      title: work.title,
      version: work.version,
      tags: ["Original"],
      categories: [{ id: firstCategory.id }],
      coverAssetId: null,
      backgroundAssetId: null,
    });
    await expect(
      database.mediaReferenceEvent.count({
        where: { reference: { workId: work.id } },
      }),
    ).resolves.toBe(0);
    await expect(
      database.workCategory.findMany({ where: { workId: work.id } }),
    ).resolves.toMatchObject([{ categoryId: firstCategory.id }]);
  });
});
