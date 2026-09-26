import type {
  PublicationStatus as ContractPublicationStatus,
  StoryStatus as ContractStoryStatus,
  StructuredTextDocument,
  WorkType as ContractWorkType,
} from "@fury/contracts";
import { structuredTextDocumentSchema } from "@fury/contracts";
import {
  ChapterContentType,
  PublicationStatus,
  StoryStatus,
  WorkType,
} from "@fury/database";

import {
  ContentImmutableException,
  ContentNotReadyException,
  ContentFeaturedConflictException,
  ContentTransitionConflictException,
  ContentTypeConflictException,
} from "./content.errors.js";

const workTypeToDatabase = {
  manga: WorkType.MANGA,
  manhwa: WorkType.MANHWA,
  manhua: WorkType.MANHUA,
  comics: WorkType.COMICS,
  novel: WorkType.NOVEL,
  "text-story": WorkType.TEXT_STORY,
} as const satisfies Record<ContractWorkType, WorkType>;

const storyStatusToDatabase = {
  ongoing: StoryStatus.ONGOING,
  completed: StoryStatus.COMPLETED,
  hiatus: StoryStatus.HIATUS,
  cancelled: StoryStatus.CANCELLED,
} as const satisfies Record<ContractStoryStatus, StoryStatus>;

const publicationStatusToDatabase = {
  draft: PublicationStatus.DRAFT,
  published: PublicationStatus.PUBLISHED,
  archived: PublicationStatus.ARCHIVED,
} as const satisfies Record<ContractPublicationStatus, PublicationStatus>;

export const toDatabaseWorkType = (value: ContractWorkType): WorkType =>
  workTypeToDatabase[value];

export const toDatabaseStoryStatus = (
  value: ContractStoryStatus,
): StoryStatus => storyStatusToDatabase[value];

export const toDatabasePublicationStatus = (
  value: ContractPublicationStatus,
): PublicationStatus => publicationStatusToDatabase[value];

export const deriveChapterContentType = (
  workType: WorkType,
): ChapterContentType =>
  workType === WorkType.NOVEL || workType === WorkType.TEXT_STORY
    ? ChapterContentType.TEXT
    : ChapterContentType.ILLUSTRATED;

export const assertImmutableValue = (
  field: "Category slug" | "Work slug" | "Work type",
  persisted: string,
  submitted: string | undefined,
): void => {
  if (submitted !== undefined && submitted !== persisted) {
    throw new ContentImmutableException(field + " is immutable.");
  }
};

export const normalizeWorkTags = (tags: readonly string[]): string[] => {
  const normalized = tags.map((tag) => tag.trim().normalize("NFC"));
  const hasControl = normalized.some((tag) =>
    Array.from(tag).some((character) => {
      const code = character.codePointAt(0) ?? 0;
      return (
        (code < 32 && code !== 9 && code !== 10 && code !== 13) || code === 127
      );
    }),
  );
  if (
    normalized.length > 20 ||
    normalized.some((tag) => tag.length < 1 || tag.length > 40) ||
    hasControl ||
    new Set(normalized).size !== normalized.length
  ) {
    throw new ContentTypeConflictException("Work tags are invalid.");
  }
  return normalized;
};

export type WorkReadinessInput = Readonly<{
  title: string;
  synopsis: string | null;
  author: string | null;
  enabledCategoryCount: number;
  hasAvailableCover: boolean;
}>;

export type WorkReadinessIssue =
  "title" | "synopsis" | "author" | "categoryIds" | "coverAssetId";

export const findWorkReadinessIssues = (
  input: WorkReadinessInput,
): WorkReadinessIssue[] => {
  const issues: WorkReadinessIssue[] = [];
  if (input.title.trim().length === 0) issues.push("title");
  if (
    input.synopsis === null ||
    input.synopsis.trim().length < 20 ||
    input.synopsis.length > 5_000
  ) {
    issues.push("synopsis");
  }
  if (
    input.author === null ||
    input.author.trim().length === 0 ||
    input.author.length > 150
  ) {
    issues.push("author");
  }
  if (input.enabledCategoryCount < 1) issues.push("categoryIds");
  if (!input.hasAvailableCover) issues.push("coverAssetId");
  return issues;
};

export const assertWorkReady = (input: WorkReadinessInput): void => {
  const issues = findWorkReadinessIssues(input);
  if (issues.length > 0) throw new ContentNotReadyException(issues);
};

export const assertFeaturedPositionAvailable = (
  featuredHome: boolean,
  featuredOrder: number | null,
  occupied: boolean,
): void => {
  if (featuredHome && featuredOrder !== null && occupied) {
    throw new ContentFeaturedConflictException();
  }
};

export const assertPositiveChapterNumber = (value: number): void => {
  if (!Number.isSafeInteger(value) || value < 1 || value > 2_147_483_647) {
    throw new ContentTransitionConflictException(
      "Chapter number must be a positive integer.",
    );
  }
};

export function assertStructuredTextDocument(
  value: unknown,
): asserts value is StructuredTextDocument {
  if (!structuredTextDocumentSchema.safeParse(value).success) {
    throw new ContentTypeConflictException(
      "Text Chapters require valid structured text.",
    );
  }
}

export const assertChapterPageSequence = (
  pages: readonly Readonly<{ position: number }>[],
): void => {
  const positions = new Set<number>();
  if (pages.length < 1 || pages.length > 500) {
    throw new ContentTypeConflictException(
      "Submitted illustrated page sequences must contain 1 to 500 pages.",
    );
  }
  for (const { position } of pages) {
    if (
      !Number.isSafeInteger(position) ||
      position < 1 ||
      position > 2_147_483_647 ||
      positions.has(position)
    ) {
      throw new ContentTypeConflictException(
        "Illustrated page positions must be unique positive integers.",
      );
    }
    positions.add(position);
  }
};

const transitionKey = (
  current: PublicationStatus,
  target: PublicationStatus,
): string => current + ":" + target;

const allowedTransitions = new Set([
  transitionKey(PublicationStatus.DRAFT, PublicationStatus.PUBLISHED),
  transitionKey(PublicationStatus.DRAFT, PublicationStatus.ARCHIVED),
  transitionKey(PublicationStatus.PUBLISHED, PublicationStatus.DRAFT),
  transitionKey(PublicationStatus.PUBLISHED, PublicationStatus.ARCHIVED),
  transitionKey(PublicationStatus.ARCHIVED, PublicationStatus.DRAFT),
]);

export const assertPublicationTransition = (
  current: PublicationStatus,
  target: PublicationStatus,
): void => {
  if (current === target) return;
  if (!allowedTransitions.has(transitionKey(current, target))) {
    throw new ContentTransitionConflictException();
  }
};
