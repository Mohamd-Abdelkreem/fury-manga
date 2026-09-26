import type {
  AdminWork,
  CreateWorkBody,
  UpdateWorkBody,
} from "@fury/contracts";

import {
  emptyWorkFormValues,
  tagsFromForm,
  type FormValues,
} from "./admin-work-form";

export type WorkEditorState = Readonly<{
  workId: string | null;
  baseVersion: number | null;
  dirty: boolean;
  values: FormValues;
  conflictWork: AdminWork | null;
}>;

export type MediaDraftSelection = Readonly<{
  attachedAssetId: string | null;
  candidateAssetId: string | null;
  clearAttached: boolean;
}>;

export const workFormValuesFromServer = (work: AdminWork): FormValues => ({
  title: work.title,
  slug: work.slug,
  alternativeTitle: work.alternativeTitle ?? "",
  type: work.type,
  storyStatus: work.storyStatus,
  synopsis: work.synopsis ?? "",
  author: work.author ?? "",
  artist: work.artist ?? "",
  categoryIds: work.categories.map(({ id }) => id),
  tagsText: work.tags.join("، "),
  featuredHome: work.featuredHome,
  featuredOrderText: work.featuredOrder?.toString() ?? "",
  coverAssetId: work.coverAssetId,
  backgroundAssetId: work.backgroundAssetId,
});

export const createWorkEditorState = (
  work: AdminWork | null,
): WorkEditorState => ({
  workId: work?.id ?? null,
  baseVersion: work?.version ?? null,
  dirty: false,
  values:
    work === null ? emptyWorkFormValues() : workFormValuesFromServer(work),
  conflictWork: null,
});

export const receiveWorkRefresh = (
  state: WorkEditorState,
  activeWorkId: string,
  incoming: AdminWork,
): WorkEditorState => {
  if (state.workId !== activeWorkId || incoming.id !== activeWorkId) {
    return state;
  }
  if (state.dirty) {
    if (state.baseVersion !== null && incoming.version > state.baseVersion) {
      return { ...state, conflictWork: incoming };
    }
    return state;
  }
  return createWorkEditorState(incoming);
};

export const adoptServerWork = (state: WorkEditorState): WorkEditorState =>
  state.conflictWork === null
    ? state
    : createWorkEditorState(state.conflictWork);

export const continueDraftAgainstServer = (
  state: WorkEditorState,
): WorkEditorState =>
  state.conflictWork === null
    ? state
    : {
        ...state,
        baseVersion: state.conflictWork.version,
        conflictWork: null,
        dirty: true,
      };

export const nullableEditorialValue = (value: string): string | null => {
  const normalized = value.trim().normalize("NFC");
  return normalized.length === 0 ? null : normalized;
};

export const workCommonFieldsFromForm = (values: FormValues) => ({
  title: values.title,
  alternativeTitle: nullableEditorialValue(values.alternativeTitle),
  synopsis: nullableEditorialValue(values.synopsis),
  author: nullableEditorialValue(values.author),
  artist: nullableEditorialValue(values.artist),
  categoryIds: values.categoryIds,
  tags: tagsFromForm(values.tagsText),
  featuredHome: values.featuredHome,
  featuredOrder: values.featuredHome ? Number(values.featuredOrderText) : null,
});

export const mediaAssetForSave = (
  selection: MediaDraftSelection,
): string | null | undefined => {
  if (selection.clearAttached) {
    return selection.attachedAssetId === null ? undefined : null;
  }
  if (
    selection.candidateAssetId !== null &&
    selection.candidateAssetId !== selection.attachedAssetId
  ) {
    return selection.candidateAssetId;
  }
  return undefined;
};

export const createWorkCommand = (
  values: FormValues,
  id: string,
  cover: MediaDraftSelection,
  background: MediaDraftSelection,
): CreateWorkBody => {
  const coverAssetId = mediaAssetForSave(cover);
  const backgroundAssetId = mediaAssetForSave(background);
  return {
    id,
    ...workCommonFieldsFromForm(values),
    slug: values.slug,
    type: values.type,
    storyStatus: values.storyStatus,
    ...(coverAssetId === undefined ? {} : { coverAssetId }),
    ...(backgroundAssetId === undefined ? {} : { backgroundAssetId }),
  };
};

export const updateWorkCommand = (
  values: FormValues,
  expectedVersion: number,
  cover: MediaDraftSelection,
  background: MediaDraftSelection,
): UpdateWorkBody => {
  const common = workCommonFieldsFromForm(values);
  const coverAssetId = mediaAssetForSave(cover);
  const backgroundAssetId = mediaAssetForSave(background);
  return {
    expectedVersion,
    title: common.title,
    storyStatus: values.storyStatus,
    alternativeTitle: common.alternativeTitle,
    synopsis: common.synopsis,
    author: common.author,
    artist: common.artist,
    categoryIds: common.categoryIds,
    tags: common.tags,
    featuredHome: common.featuredHome,
    featuredOrder: common.featuredOrder,
    ...(coverAssetId === undefined ? {} : { coverAssetId }),
    ...(backgroundAssetId === undefined ? {} : { backgroundAssetId }),
  };
};

export const createPublishedWorkCommand = (
  values: FormValues,
  id: string,
  cover: MediaDraftSelection,
  background: MediaDraftSelection,
): CreateWorkBody => ({
  ...createWorkCommand(values, id, cover, background),
  targetState: "published",
});

export const updatePublishedWorkCommand = (
  values: FormValues,
  expectedVersion: number,
  cover: MediaDraftSelection,
  background: MediaDraftSelection,
): UpdateWorkBody => ({
  ...updateWorkCommand(values, expectedVersion, cover, background),
  targetState: "published",
});

export const workMatchesCreateCommand = (
  work: AdminWork,
  body: CreateWorkBody,
): boolean => {
  const expectedCategoryIds = [...(body.categoryIds ?? [])].toSorted();
  const savedCategoryIds = work.categories.map(({ id }) => id).toSorted();
  return (
    work.id === body.id &&
    work.title === body.title &&
    work.slug === body.slug &&
    work.type === body.type &&
    work.storyStatus === body.storyStatus &&
    work.publicationStatus === (body.targetState ?? "draft") &&
    work.alternativeTitle === (body.alternativeTitle ?? null) &&
    work.synopsis === (body.synopsis ?? null) &&
    work.author === (body.author ?? null) &&
    work.artist === (body.artist ?? null) &&
    work.coverAssetId === (body.coverAssetId ?? null) &&
    work.backgroundAssetId === (body.backgroundAssetId ?? null) &&
    work.featuredHome === (body.featuredHome ?? false) &&
    work.featuredOrder === (body.featuredOrder ?? null) &&
    expectedCategoryIds.length === savedCategoryIds.length &&
    expectedCategoryIds.every((id, index) => id === savedCategoryIds[index]) &&
    work.tags.length === (body.tags ?? []).length &&
    work.tags.every((tag, index) => tag === body.tags?.[index])
  );
};

export const workMatchesUpdateCommand = (
  work: AdminWork,
  body: UpdateWorkBody,
): boolean => {
  const expectedCategoryIds = [...(body.categoryIds ?? [])].toSorted();
  const savedCategoryIds = work.categories.map(({ id }) => id).toSorted();
  return (
    work.version >= body.expectedVersion &&
    work.title === body.title &&
    work.storyStatus === body.storyStatus &&
    work.alternativeTitle === body.alternativeTitle &&
    work.synopsis === body.synopsis &&
    work.author === body.author &&
    work.artist === body.artist &&
    work.featuredHome === body.featuredHome &&
    work.featuredOrder === body.featuredOrder &&
    (body.targetState === undefined ||
      work.publicationStatus === body.targetState) &&
    (body.coverAssetId === undefined ||
      work.coverAssetId === body.coverAssetId) &&
    (body.backgroundAssetId === undefined ||
      work.backgroundAssetId === body.backgroundAssetId) &&
    expectedCategoryIds.length === savedCategoryIds.length &&
    expectedCategoryIds.every((id, index) => id === savedCategoryIds[index]) &&
    work.tags.length === (body.tags ?? []).length &&
    work.tags.every((tag, index) => tag === body.tags?.[index])
  );
};
