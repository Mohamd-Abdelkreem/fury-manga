import { describe, expect, it } from "vitest";

import { MediaAssetStatus, MediaClass } from "@fury/database";

import { mapMediaAsset } from "./media.mapper.js";

describe("private media projection", () => {
  it("returns only the shared asset fields", () => {
    const record = {
      id: "43afae94-0e94-45e9-ab76-100f889d0777",
      mediaClass: MediaClass.WORK_COVER,
      status: MediaAssetStatus.AVAILABLE,
      contentType: "image/png",
      byteLength: 500,
      width: 600,
      height: 800,
      createdAt: new Date("2026-09-23T10:00:00.000Z"),
      relativeKey: "private-file-key",
      sha256: "a".repeat(64),
      uploadedByUserId: "11111111-1111-4111-8111-111111111111",
    };
    const mapped = mapMediaAsset(record);
    expect(mapped).toEqual({
      id: "43afae94-0e94-45e9-ab76-100f889d0777",
      mediaClass: "work_cover",
      status: "available",
      contentType: "image/png",
      byteLength: 500,
      width: 600,
      height: 800,
      contentPath:
        "/api/v1/media/assets/43afae94-0e94-45e9-ab76-100f889d0777/content",
      createdAt: "2026-09-23T10:00:00.000Z",
    });
    expect(JSON.stringify(mapped)).not.toContain("private-file-key");
  });
});
