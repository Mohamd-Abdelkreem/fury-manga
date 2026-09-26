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

describe("P03 Prisma schema", () => {
  it("adds editorial tags without changing the P01/P02 model identities", () => {
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
      "WorkTag",
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

  it("declares additive nullable work metadata and category ordering", () => {
    const work = schema.match(/^model Work \{[\s\S]*?^\}/mu)?.[0] ?? "";
    const category = schema.match(/^model Category \{[\s\S]*?^\}/mu)?.[0] ?? "";
    const tag = schema.match(/^model WorkTag \{[\s\S]*?^\}/mu)?.[0] ?? "";

    expect(work).toMatch(/^\s{2}alternativeTitle\s+String\?/mu);
    expect(work).toMatch(/^\s{2}synopsis\s+String\?/mu);
    expect(work).toMatch(/^\s{2}author\s+String\?/mu);
    expect(work).toMatch(/^\s{2}artist\s+String\?/mu);
    expect(work).toMatch(/^\s{2}featuredHome\s+Boolean\s+@default\(false\)/mu);
    expect(work).toMatch(/^\s{2}featuredOrder\s+Int\?/mu);
    expect(work).toMatch(/^\s{2}tags\s+WorkTag\[\]/mu);
    expect(category).toMatch(/^\s{2}enabled\s+Boolean\s+@default\(true\)/mu);
    expect(category).toMatch(
      /^\s{2}displayPosition\s+Int\s+@default\(dbgenerated\(/mu,
    );
    expect(category).toContain("@@unique([displayPosition]");
    expect(tag).toContain("normalizedTag");
    expect(tag).toContain("@@id([workId, normalizedTag])");
    expect(tag).toContain("@@unique([workId, position]");
  });

  it("keeps account/session ownership and excludes later product domains", () => {
    expect(schema).toContain("model User");
    expect(schema).toContain("model RefreshToken");
    expect(schema).not.toMatch(
      /Bookmark|Rating|Comment|Notification|Gift|Advertisement/u,
    );
  });
});
