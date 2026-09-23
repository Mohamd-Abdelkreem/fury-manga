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
