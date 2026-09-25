import { describe, expect, it } from "vitest";

import {
  MEDIA_SOURCE_BYTE_LIMITS,
  mediaAssetParamsSchema,
  mediaAssetListResponseSchema,
  mediaAssetResponseSchema,
  mediaAssetSchema,
  mediaAttemptSchema,
  mediaClassSchema,
  mediaListQuerySchema,
  mediaUploadFieldSchema,
  mediaUploadHeaderSchema,
  mediaRemovalResponseSchema,
  mediaReferenceCreateSchema,
  mediaReferenceQuerySchema,
  mediaReferenceReplaceSchema,
  mediaReferenceRetireSchema,
  mediaReferenceSchema,
  mediaReferenceRetirementSchema,
} from "./media.schema.ts";

const asset = {
  id: "43afae94-0e94-45e9-ab76-100f889d0777",
  mediaClass: "work_cover",
  status: "available",
  contentType: "image/webp",
  byteLength: 1400,
  width: 600,
  height: 800,
  contentPath:
    "/api/v1/media/assets/43afae94-0e94-45e9-ab76-100f889d0777/content",
  createdAt: "2026-09-23T10:00:00.000Z",
};

describe("private media wire contracts", () => {
  it("accepts the five admin classes and rejects invented classes", () => {
    for (const mediaClass of [
      "work_cover",
      "work_background",
      "chapter_page",
      "avatar_frame",
      "comment_decoration",
    ]) {
      expect(mediaClassSchema.safeParse(mediaClass).success).toBe(true);
    }
    expect(mediaClassSchema.safeParse("gift_grant").success).toBe(false);
  });

  it("defines the owner-avatar class and its inclusive 4 MiB source boundary", () => {
    expect(mediaClassSchema.parse("user_avatar")).toBe("user_avatar");
    expect(MEDIA_SOURCE_BYTE_LIMITS.user_avatar).toBe(4 * 1024 * 1024);
  });

  it("rejects owner/path claims and malformed attempt or asset identifiers", () => {
    expect(
      mediaUploadFieldSchema.safeParse({ mediaClass: "work_cover" }).success,
    ).toBe(true);
    expect(
      mediaUploadFieldSchema.safeParse({
        mediaClass: "work_cover",
        ownerUserId: asset.id,
      }).success,
    ).toBe(false);
    expect(
      mediaUploadHeaderSchema.safeParse({ "idempotency-key": asset.id })
        .success,
    ).toBe(true);
    expect(
      mediaUploadHeaderSchema.safeParse({ "idempotency-key": "../file" })
        .success,
    ).toBe(false);
    expect(
      mediaAssetParamsSchema.safeParse({ assetId: asset.id }).success,
    ).toBe(true);
    expect(
      mediaAssetParamsSchema.safeParse({ assetId: "../file" }).success,
    ).toBe(false);
  });

  it("allowlists asset and attempt output without private fields", () => {
    expect(mediaAssetSchema.safeParse(asset).success).toBe(true);
    expect(
      mediaAssetSchema.safeParse({ ...asset, relativeKey: "private" }).success,
    ).toBe(false);
    expect(
      mediaAttemptSchema.safeParse({
        id: asset.id,
        mediaClass: "work_cover",
        state: "pending",
        assetId: null,
        safeFailureCode: null,
        createdAt: asset.createdAt,
        completedAt: null,
      }).success,
    ).toBe(true);
    expect(
      mediaAttemptSchema.safeParse({
        id: asset.id,
        mediaClass: "work_cover",
        state: "accepted",
        assetId: null,
        safeFailureCode: null,
        createdAt: asset.createdAt,
        completedAt: asset.createdAt,
      }).success,
    ).toBe(false);
    expect(
      mediaAssetResponseSchema.safeParse({
        success: true,
        statusCode: 201,
        message: "Uploaded",
        data: asset,
        requestId: "req-1",
        timestamp: asset.createdAt,
        path: "/api/v1/media/assets",
      }).success,
    ).toBe(true);
  });

  it("bounds and scopes lists without admitting unknown filters", () => {
    expect(mediaListQuerySchema.parse({ scope: "admin" })).toMatchObject({
      scope: "admin",
      page: 1,
      limit: 25,
    });
    for (const query of [
      { scope: "admin", limit: "101" },
      { scope: "admin", page: "0" },
      { scope: "admin", ownerUserId: asset.id },
      { scope: "mine", mediaClass: "work_cover" },
      { scope: "admin", mediaClass: null },
      { scope: "admin", mediaClass: "" },
      { scope: "admin", page: "100001" },
    ]) {
      expect(mediaListQuerySchema.safeParse(query).success).toBe(false);
    }
    expect(
      mediaAssetListResponseSchema.safeParse({
        success: true,
        statusCode: 200,
        message: "Listed",
        data: {
          items: [],
          pagination: {
            page: 4,
            limit: 25,
            total: 0,
            totalPages: 0,
            hasNextPage: false,
            hasPreviousPage: true,
          },
        },
        requestId: "req-list",
        timestamp: asset.createdAt,
        path: "/api/v1/media/assets",
      }).success,
    ).toBe(true);
  });

  it("accepts only owner-avatar filters for mine scope", () => {
    expect(mediaListQuerySchema.parse({ scope: "mine" })).toMatchObject({
      scope: "mine",
    });
    expect(
      mediaListQuerySchema.parse({ scope: "mine", mediaClass: "user_avatar" }),
    ).toMatchObject({ scope: "mine", mediaClass: "user_avatar" });
    for (const query of [
      { scope: "mine", mediaClass: "avatar_frame" },
      { scope: "mine", mediaClass: "user_avatar", ownerUserId: asset.id },
      { scope: "admin", mediaClass: "user_avatar" },
    ]) {
      expect(mediaListQuerySchema.safeParse(query).success).toBe(false);
    }
  });

  it("keeps avatar and removal projections private and strict", () => {
    const avatar = { ...asset, mediaClass: "user_avatar" };
    expect(mediaAssetSchema.parse(avatar)).not.toHaveProperty("ownerUserId");
    expect(
      mediaAssetSchema.safeParse({ ...avatar, ownerUserId: asset.id }).success,
    ).toBe(false);
    const response = {
      success: true,
      statusCode: 200,
      message: "Removed",
      data: { id: asset.id, status: "removed" },
      requestId: "req-remove",
      timestamp: asset.createdAt,
      path: `/api/v1/media/assets/${asset.id}`,
    };
    expect(mediaRemovalResponseSchema.safeParse(response).success).toBe(true);
    expect(
      mediaRemovalResponseSchema.safeParse({
        ...response,
        data: { ...response.data, relativeKey: "private" },
      }).success,
    ).toBe(false);
  });

  it("rejects unknown upload, params, list, asset, and attempt fields", () => {
    expect(
      mediaUploadFieldSchema.safeParse({
        mediaClass: "user_avatar",
        path: "avatar.png",
      }).success,
    ).toBe(false);
    expect(
      mediaUploadHeaderSchema.safeParse({
        "idempotency-key": asset.id,
        "x-owner-id": asset.id,
      }).success,
    ).toBe(false);
    expect(
      mediaAssetParamsSchema.safeParse({ assetId: asset.id, extra: true })
        .success,
    ).toBe(false);
    expect(
      mediaAttemptSchema.safeParse({
        id: asset.id,
        mediaClass: "user_avatar",
        state: "pending",
        assetId: null,
        safeFailureCode: null,
        createdAt: asset.createdAt,
        completedAt: null,
        sourceSha256: "private",
      }).success,
    ).toBe(false);
  });

  it("defines strict reference target, bind, replace, and retire commands", () => {
    const targetId = "ff4f24b3-b11d-429a-9e4f-a94f8ce02436";
    expect(
      mediaReferenceQuerySchema.parse({
        targetKind: "work_cover",
        targetId,
      }),
    ).toEqual({ targetKind: "work_cover", targetId });
    expect(
      mediaReferenceCreateSchema.parse({
        targetKind: "chapter_page",
        targetId,
        assetId: asset.id,
      }),
    ).toMatchObject({ targetKind: "chapter_page", assetId: asset.id });
    expect(
      mediaReferenceReplaceSchema.parse({
        assetId: targetId,
        expectedAssetId: asset.id,
        expectedVersion: 0,
      }),
    ).toMatchObject({ expectedVersion: 0 });
    expect(
      mediaReferenceRetireSchema.parse({
        expectedAssetId: asset.id,
        expectedVersion: 1,
      }),
    ).toMatchObject({ expectedVersion: 1 });

    for (const command of [
      { targetKind: "work_cover", targetId, assetId: asset.id, version: 0 },
      { assetId: targetId, expectedAssetId: asset.id, expectedVersion: -1 },
      { expectedAssetId: asset.id, expectedVersion: 0, force: true },
    ]) {
      expect(
        [
          mediaReferenceCreateSchema,
          mediaReferenceReplaceSchema,
          mediaReferenceRetireSchema,
        ].some((schema) => schema.safeParse(command).success),
      ).toBe(false);
    }
  });

  it("keeps active reference and retirement projections strict", () => {
    const reference = {
      id: "55aec196-95e6-4763-a5a7-d43fb6cc9553",
      targetKind: "work_background",
      targetId: "ff4f24b3-b11d-429a-9e4f-a94f8ce02436",
      assetId: asset.id,
      version: 2,
      createdAt: asset.createdAt,
      updatedAt: asset.createdAt,
    };
    expect(mediaReferenceSchema.parse(reference)).toEqual(reference);
    expect(
      mediaReferenceSchema.safeParse({ ...reference, relativeKey: "private" })
        .success,
    ).toBe(false);
    expect(
      mediaReferenceRetirementSchema.parse({
        id: reference.id,
        status: "retired",
        version: 3,
      }),
    ).toMatchObject({ status: "retired", version: 3 });
  });
});
