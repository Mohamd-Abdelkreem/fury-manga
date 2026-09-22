import type {
  AdminPublishStatus,
  AdminStoryStatus,
  AdminWorkType,
} from "../../types/admin.types";

export interface FormValues {
  title: string;
  alternativeTitle: string;
  type: AdminWorkType;
  storyStatus: AdminStoryStatus;
  publishStatus: AdminPublishStatus;
  description: string;
  author: string;
  artist: string;
  genres: string[];
  tags: string;
  coverImage: string;
  bannerImage: string;
}

export interface FormErrors {
  title?: string | undefined;
  description?: string | undefined;
  author?: string | undefined;
  genres?: string | undefined;
}

export type WorkFieldChange = <K extends keyof FormValues>(
  field: K,
  value: FormValues[K],
) => void;
