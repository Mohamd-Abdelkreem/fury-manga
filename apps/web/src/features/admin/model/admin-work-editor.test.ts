import { describe, expect, it } from "vitest";

import type { AdminWork } from "@fury/contracts";

import {
  adoptServerWork,
  continueDraftAgainstServer,
  createWorkEditorState,
  createWorkCommand,
  updateWorkCommand,
  mediaAssetForSave,
  nullableEditorialValue,
  receiveWorkRefresh,
  workFormValuesFromServer,
} from "./admin-work-editor";

const work: AdminWork = {
  id: "33333333-3333-4333-8333-333333333333",
  title: "Saved title",
  alternativeTitle: "Alternate title",
  synopsis: "A saved synopsis long enough for the work editor.",
  author: "Saved author",
  artist: null,
  slug: "saved-title",
  type: "manga",
  storyStatus: "ongoing",
  publicationStatus: "draft",
  publishedAt: null,
  featuredHome: false,
  featuredOrder: null,
  coverAssetId: "44444444-4444-4444-8444-444444444444",
  backgroundAssetId: null,
  tags: ["Adventure", "Mystery"],
  version: 2,
  createdAt: "2026-09-25T10:00:00.000Z",
  updatedAt: "2026-09-25T10:00:00.000Z",
  categories: [],
};

const newerWork: AdminWork = {
  ...work,
  title: "Server title",
  version: 3,
  updatedAt: "2026-09-26T10:00:00.000Z",
};

describe("admin Work editor refresh and draft state", () => {
  it("adopts pristine server refreshes while preserving and surfacing dirty conflicts", () => {
    const pristine = createWorkEditorState(work);
    const refreshedPristine = receiveWorkRefresh(pristine, work.id, newerWork);
    expect(refreshedPristine.values.title).toBe("Server title");
    expect(refreshedPristine.baseVersion).toBe(3);
    expect(refreshedPristine.dirty).toBe(false);

    const dirty = {
      ...pristine,
      dirty: true,
      values: { ...pristine.values, title: "Local unsaved title" },
    };
    const refreshedDirty = receiveWorkRefresh(dirty, work.id, newerWork);
    expect(refreshedDirty.values.title).toBe("Local unsaved title");
    expect(refreshedDirty.baseVersion).toBe(2);
    expect(refreshedDirty.conflictWork).toEqual(newerWork);
  });

  it("supports explicit adopt-server and continue-draft conflict resolutions", () => {
    const local = {
      ...createWorkEditorState(work),
      dirty: true,
      values: { ...createWorkEditorState(work).values, title: "Local draft" },
    };
    const conflicted = receiveWorkRefresh(local, work.id, newerWork);

    expect(adoptServerWork(conflicted)).toMatchObject({
      baseVersion: 3,
      dirty: false,
      conflictWork: null,
      values: { title: "Server title" },
    });
    expect(continueDraftAgainstServer(conflicted)).toMatchObject({
      baseVersion: 3,
      dirty: true,
      conflictWork: null,
      values: { title: "Local draft" },
    });
  });

  it("ignores late detail results for a different route resource", () => {
    const state = createWorkEditorState(work);
    expect(
      receiveWorkRefresh(
        state,
        "55555555-5555-4555-8555-555555555555",
        newerWork,
      ),
    ).toBe(state);
    const wrongResourceState = {
      ...state,
      workId: "55555555-5555-4555-8555-555555555555",
    };
    expect(
      receiveWorkRefresh(
        wrongResourceState,
        "55555555-5555-4555-8555-555555555555",
        newerWork,
      ),
    ).toBe(wrongResourceState);
  });

  it("keeps nullable clears and staged media distinct from saved references", () => {
    expect(nullableEditorialValue("   ")).toBeNull();
    expect(nullableEditorialValue("  Author  ")).toBe("Author");
    expect(
      mediaAssetForSave({
        attachedAssetId: work.coverAssetId,
        candidateAssetId: null,
        clearAttached: false,
      }),
    ).toBeUndefined();
    expect(
      mediaAssetForSave({
        attachedAssetId: work.coverAssetId,
        candidateAssetId: "66666666-6666-4666-8666-666666666666",
        clearAttached: false,
      }),
    ).toBe("66666666-6666-4666-8666-666666666666");
    expect(
      mediaAssetForSave({
        attachedAssetId: work.coverAssetId,
        candidateAssetId: null,
        clearAttached: true,
      }),
    ).toBeNull();
    expect(
      mediaAssetForSave({
        attachedAssetId: null,
        candidateAssetId: "66666666-6666-4666-8666-666666666666",
        clearAttached: true,
      }),
    ).toBeUndefined();
  });

  it("shapes immutable create fields and nullable editorial/media values without adding edit-only version", () => {
    const values = {
      ...workFormValuesFromServer(work),
      title: "New draft",
      slug: "new-draft",
      type: "text-story" as const,
      author: "  ",
    };
    const unchanged = {
      attachedAssetId: work.coverAssetId,
      candidateAssetId: null,
      clearAttached: false,
    };
    const removed = {
      attachedAssetId: work.coverAssetId,
      candidateAssetId: null,
      clearAttached: true,
    };
    expect(
      createWorkCommand(values, work.id, unchanged, removed),
    ).toMatchObject({
      id: work.id,
      slug: "new-draft",
      type: "text-story",
      storyStatus: work.storyStatus,
      title: "New draft",
      author: null,
      backgroundAssetId: null,
    });
    const body = createWorkCommand(values, work.id, unchanged, removed);
    expect(body).not.toHaveProperty("coverAssetId");
    expect(body).not.toHaveProperty("expectedVersion");
    expect(body.backgroundAssetId).toBeNull();
  });

  it("shapes edit version and explicit clears without immutable slug/type", () => {
    const values = workFormValuesFromServer(work);
    const removed = {
      attachedAssetId: work.coverAssetId,
      candidateAssetId: null,
      clearAttached: true,
    };
    const candidate = {
      attachedAssetId: null,
      candidateAssetId: "66666666-6666-4666-8666-666666666666",
      clearAttached: false,
    };
    const body = updateWorkCommand(values, work.version, removed, candidate);
    expect(body).toMatchObject({
      expectedVersion: 2,
      coverAssetId: null,
      backgroundAssetId: candidate.candidateAssetId,
      tags: work.tags,
    });
    expect(body).not.toHaveProperty("slug");
    expect(body).not.toHaveProperty("type");
    expect(
      updateWorkCommand(
        values,
        3,
        { ...removed, clearAttached: false },
        { ...candidate, candidateAssetId: null },
      ),
    ).not.toHaveProperty("coverAssetId");
  });

  it("maps persisted type, saved category IDs, and private media IDs to form values", () => {
    const textStory: AdminWork = { ...work, type: "text-story" };
    expect(workFormValuesFromServer(textStory)).toMatchObject({
      type: "text-story",
      categoryIds: [],
      slug: work.slug,
      tagsText: "Adventure، Mystery",
    });
  });
});
