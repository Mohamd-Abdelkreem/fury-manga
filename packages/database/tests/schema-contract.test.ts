import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const currentDirectory = dirname(fileURLToPath(import.meta.url));
const packageRoot = join(currentDirectory, "..");
const schema = readFileSync(
  join(packageRoot, "prisma", "schema.prisma"),
  "utf8",
);

describe("P02 Prisma schema", () => {
  it("adds private media identities without later product models", () => {
    const models = [...schema.matchAll(/^model\s+(\w+)/gmu)].map(
      (match) => match[1],
    );
    const enums = [...schema.matchAll(/^enum\s+(\w+)/gmu)].map(
      (match) => match[1],
    );
    expect(models).toEqual([
      "User",
      "RefreshToken",
      "Work",
      "Category",
      "WorkCategory",
      "Chapter",
      "ChapterPage",
      "PublicationEvent",
      "MediaAsset",
      "UploadAttempt",
      "MediaReference",
      "MediaReferenceEvent",
    ]);
    expect(enums).toEqual([
      "UserRole",
      "UserStatus",
      "WorkType",
      "StoryStatus",
      "PublicationStatus",
      "ChapterContentType",
      "MediaClass",
      "MediaScope",
      "MediaAssetStatus",
      "UploadAttemptState",
      "MediaReferenceSlot",
      "MediaReferenceAction",
    ]);
  });

  it("keeps account/session ownership and excludes later product domains", () => {
    expect(schema).toContain("model User");
    expect(schema).toContain("model RefreshToken");
    expect(schema).not.toMatch(
      /Bookmark|Rating|Comment|Notification|Gift|Advertisement/u,
    );
  });
});
