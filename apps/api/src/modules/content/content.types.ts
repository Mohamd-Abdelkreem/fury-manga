import type { PaginationMeta } from "@fury/contracts";
import type { PublicationStatus } from "@fury/database";

export type ContentList<T> = Readonly<{
  items: T[];
  pagination: PaginationMeta;
}>;

export type PublicationDependencies = Readonly<{
  currentTime: () => Date;
  createIdentifier: () => string;
}>;

export type PublicationResourceType = "work" | "chapter";
export type PublicationWrite = Readonly<{
  eventId: string | null;
  publishedAt: Date | null;
}>;
export type PublicationRecord = Readonly<{
  id: string;
  publicationStatus: PublicationStatus;
  publishedAt: Date | null;
  currentPublicationEventId: string | null;
  version: number;
}>;
