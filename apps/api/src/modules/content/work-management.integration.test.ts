import { randomUUID } from "node:crypto";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import sharp from "sharp";
import { afterAll, beforeEach, describe, expect, it } from "vitest";

import type { CreateWorkBody } from "@fury/contracts";
import { createDatabaseClient, UserRole, UserStatus } from "@fury/database";

import { createMediaConfig } from "../../core/config/media.config.js";
import { MediaStorage } from "../../infrastructure/media/media-storage.js";
import { CategoryManagementService } from "./category-management.service.js";
import { ContentConflictException } from "./content.errors.js";
import { WorkManagementService } from "./work-management.service.js";
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
