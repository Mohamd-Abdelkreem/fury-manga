import { createDatabaseClient } from "@fury/database";
import { randomUUID } from "node:crypto";
import { afterAll, beforeEach, describe, expect, it } from "vitest";

import {
  ContentCategoryInUseException,
  ContentConflictException,
  ContentStaleWriteException,
} from "./content.errors.js";
import { CategoryManagementService } from "./category-management.service.js";
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
const publications = new PublicationManagementService(database, {
  currentTime: () => new Date(),
  createIdentifier: randomUUID,
});
const pagination = { page: 1, limit: 25, skip: 0, take: 25 };
const fixtureActorIds: string[] = [];

const createCategory = (slug: string) =>
  categories.createCategory({ displayName: slug, slug });

const createWork = (slug: string) =>
  works.createWork({
    title: slug,
    slug,
    type: "manga",
    storyStatus: "ongoing",
  });

const createPublishedWork = async (
  slug: string,
  categoryIds: readonly string[],
) => {
  const work = await createWork(slug);
  const assigned = await works.replaceWorkCategories(work.id, {
    expectedVersion: work.version,
    categoryIds: [...categoryIds],
  });
  fixtureActorIds.push(
    await prepareWorkForPublication(database, work.id, categoryIds[0]),
  );
  await publications.publishWork(work.id, {
    expectedVersion: assigned.version,
    targetState: "published",
  });
  return work.id;
};

describe("category management with PostgreSQL", () => {
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

  it("appends categories and returns snapshot-filtered distinct usage counts", async () => {
    const first = await createCategory("action");
    const second = await createCategory("fantasy");
    const third = await createCategory("archived");
    const draft = await createWork("usage-draft");
    const draftWithCategory = await works.replaceWorkCategories(draft.id, {
      expectedVersion: draft.version,
      categoryIds: [first.id],
    });
    const publishedId = await createPublishedWork("usage-published", [
      first.id,
      second.id,
    ]);
    const archivedId = await createPublishedWork("usage-archived", [
      first.id,
      third.id,
    ]);
    const published = await works.getWork(publishedId);
    await publications.publishWork(published.id, {
      expectedVersion: published.version,
      targetState: "archived",
    });
    const archived = await works.getWork(archivedId);
    await publications.publishWork(archived.id, {
      expectedVersion: archived.version,
      targetState: "archived",
    });

    const listed = await categories.listCategories(pagination, {
      search: "act",
      enabled: true,
    });

    expect([
      first.displayPosition,
      second.displayPosition,
      third.displayPosition,
    ]).toEqual([1, 2, 3]);
    expect(first.enabled).toBe(true);
    expect(draftWithCategory.version).toBe(1);
    expect(listed.items).toHaveLength(1);
    expect(listed.items[0]).toMatchObject({
      id: first.id,
      displayPosition: 1,
      worksCount: 3,
    });
    expect(listed.pagination.total).toBe(1);
  });

  it("makes same-state updates no-ops and rejects stale actual edits", async () => {
    const category = await createCategory("state");
    const disabled = await categories.updateCategory(category.id, {
      expectedVersion: 0,
      enabled: false,
    });
    const repeated = await categories.updateCategory(category.id, {
      expectedVersion: 0,
      enabled: false,
    });

    expect(disabled).toMatchObject({ enabled: false, version: 1 });
    expect(repeated).toEqual(disabled);
    await expect(
      categories.updateCategory(category.id, {
        expectedVersion: 0,
        displayName: "Stale rename",
      }),
    ).rejects.toBeInstanceOf(ContentStaleWriteException);
  });

  it("refuses to disable a last enabled category without changing associations", async () => {
    const category = await createCategory("only-category");
    const workId = await createPublishedWork("only-category-work", [
      category.id,
    ]);

    await expect(
      categories.updateCategory(category.id, {
        expectedVersion: category.version,
        enabled: false,
      }),
    ).rejects.toBeInstanceOf(ContentCategoryInUseException);
    await expect(categories.getCategory(category.id)).resolves.toMatchObject({
      enabled: true,
      version: 0,
      worksCount: 1,
    });
    await expect(works.getWork(workId)).resolves.toMatchObject({
      categories: [{ id: category.id }],
      publicationStatus: "published",
    });
  });

  it("rejects removing the last enabled category from a published Work", async () => {
    const category = await createCategory("published-last-category");
    const workId = await createPublishedWork("published-last-category-work", [
      category.id,
    ]);
    const work = await works.getWork(workId);

    await expect(
      works.replaceWorkCategories(workId, {
        expectedVersion: work.version,
        categoryIds: [],
      }),
    ).rejects.toBeInstanceOf(ContentConflictException);
    await expect(works.getWork(workId)).resolves.toMatchObject({
      publicationStatus: "published",
      version: work.version,
      categories: [{ id: category.id, enabled: true }],
    });
  });

  it("allows safe disablement while retaining all work associations", async () => {
    const first = await createCategory("safe-first");
    const second = await createCategory("safe-second");
    const workId = await createPublishedWork("safe-disable-work", [
      first.id,
      second.id,
    ]);

    const disabled = await categories.updateCategory(first.id, {
      expectedVersion: first.version,
      enabled: false,
    });

    expect(disabled).toMatchObject({ enabled: false, worksCount: 1 });
    const savedWork = await works.getWork(workId);
    expect(
      savedWork.categories.some(
        (category) => category.id === first.id && !category.enabled,
      ),
    ).toBe(true);
    expect(
      savedWork.categories.some(
        (category) => category.id === second.id && category.enabled,
      ),
    ).toBe(true);
  });

  it("swaps only an adjacent position pair and treats an achieved move as a no-op", async () => {
    const first = await createCategory("move-first");
    const second = await createCategory("move-second");
    const third = await createCategory("move-third");

    const moved = await categories.moveCategory(second.id, {
      expectedVersion: second.version,
      targetPosition: 1,
    });
    const repeated = await categories.moveCategory(second.id, {
      expectedVersion: second.version,
      targetPosition: 1,
    });

    expect(moved.category).toMatchObject({ id: second.id, displayPosition: 1 });
    expect(moved.displacedCategory).toMatchObject({
      id: first.id,
      displayPosition: 2,
      version: first.version + 1,
    });
    expect(repeated.category).toEqual(moved.category);
    expect(repeated.displacedCategory).toBeNull();
    await expect(
      categories.moveCategory(second.id, {
        expectedVersion: second.version,
        targetPosition: 2,
      }),
    ).rejects.toBeInstanceOf(ContentStaleWriteException);
    await expect(
      categories.moveCategory(second.id, {
        expectedVersion: moved.category.version,
        targetPosition: 3,
      }),
    ).rejects.toMatchObject({ statusCode: 400, code: "VALIDATION_ERROR" });
    await expect(categories.getCategory(third.id)).resolves.toMatchObject({
      displayPosition: 3,
    });
  });

  it("serializes concurrent disablement of categories protecting one published Work", async () => {
    const first = await createCategory("concurrent-first");
    const second = await createCategory("concurrent-second");
    await createPublishedWork("concurrent-disable-work", [first.id, second.id]);

    const outcomes = await Promise.allSettled([
      categories.updateCategory(first.id, {
        expectedVersion: first.version,
        enabled: false,
      }),
      categories.updateCategory(second.id, {
        expectedVersion: second.version,
        enabled: false,
      }),
    ]);
    const successes = outcomes.filter(
      (
        outcome,
      ): outcome is PromiseFulfilledResult<
        Awaited<ReturnType<typeof categories.updateCategory>>
      > => outcome.status === "fulfilled",
    );
    const failures = outcomes.filter(
      (outcome): outcome is PromiseRejectedResult =>
        outcome.status === "rejected",
    );
    const states = await Promise.all([
      categories.getCategory(first.id),
      categories.getCategory(second.id),
    ]);

    expect(successes).toHaveLength(1);
    expect(failures).toHaveLength(1);
    expect(
      failures[0]?.reason instanceof ContentCategoryInUseException ||
        failures[0]?.reason instanceof ContentStaleWriteException,
    ).toBe(true);
    expect(states.filter(({ enabled }) => enabled)).toHaveLength(1);
  });

  it("keeps a published Work eligible when assignment races category disablement", async () => {
    const first = await createCategory("race-first");
    const second = await createCategory("race-second");
    const workId = await createPublishedWork("race-work", [second.id]);
    const currentWork = await works.getWork(workId);

    const outcomes = await Promise.allSettled([
      categories.updateCategory(first.id, {
        expectedVersion: first.version,
        enabled: false,
      }),
      works.replaceWorkCategories(workId, {
        expectedVersion: currentWork.version,
        categoryIds: [first.id],
      }),
    ]);
    const finalWork = await works.getWork(workId);
    const finalCategories = await Promise.all(
      finalWork.categories.map(({ id }) => categories.getCategory(id)),
    );
    const failures = outcomes.filter(
      (outcome): outcome is PromiseRejectedResult =>
        outcome.status === "rejected",
    );

    expect(outcomes.filter(({ status }) => status === "fulfilled").length).toBe(
      1,
    );
    expect(finalCategories.some(({ enabled }) => enabled)).toBe(true);
    expect(finalWork.publicationStatus).toBe("published");
    expect(
      failures.every(
        ({ reason }) =>
          reason instanceof ContentConflictException ||
          reason instanceof ContentCategoryInUseException ||
          reason instanceof ContentStaleWriteException,
      ),
    ).toBe(true);
  });

  it("keeps publication from racing a successful last-category disablement", async () => {
    const category = await createCategory("publication-race");
    const work = await createWork("publication-race-work");
    const assigned = await works.replaceWorkCategories(work.id, {
      expectedVersion: work.version,
      categoryIds: [category.id],
    });

    const outcomes = await Promise.allSettled([
      categories.updateCategory(category.id, {
        expectedVersion: category.version,
        enabled: false,
      }),
      publications.publishWork(work.id, {
        expectedVersion: assigned.version,
        targetState: "published",
      }),
    ]);
    const finalCategory = await categories.getCategory(category.id);
    const finalWork = await works.getWork(work.id);

    expect(outcomes.filter(({ status }) => status === "fulfilled").length).toBe(
      1,
    );
    if (finalWork.publicationStatus === "published") {
      expect(finalCategory.enabled).toBe(true);
    } else {
      expect(finalWork.publicationStatus).toBe("draft");
      expect(finalCategory.enabled).toBe(false);
    }
  });
});
