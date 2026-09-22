import type { LibraryWork } from "../../data/libraryData";

export type ContentTypeFilter = "all" | LibraryWork["contentType"];
export type StatusFilter = "all" | LibraryWork["status"];
export type ProgressFilter = "all" | "in_progress" | "not_started";
export type SortOption = "default" | "title-asc" | "title-desc" | "status";
export type ViewMode = "grid" | "list";
