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

describe("post-P01 Prisma schema", () => {
  it("contains exactly the accepted account and content models and enums", () => {
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
    ]);
    expect(enums).toEqual([
      "UserRole",
      "UserStatus",
      "WorkType",
      "StoryStatus",
      "PublicationStatus",
      "ChapterContentType",
    ]);
  });

  it("keeps account/session ownership and excludes later product domains", () => {
    expect(schema).toContain("model User");
    expect(schema).toContain("model RefreshToken");
    expect(schema).not.toMatch(
      /Bookmark|Rating|Comment|Notification|Gift|Advertisement|MediaAsset/u,
    );
  });
});
