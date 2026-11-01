import {
  catalogDetailDataSchema,
  type CatalogDetailData,
} from "@fury/contracts";

export const publicDetailFixture = (slug = "saved-work"): CatalogDetailData => {
  const chapter = {
    number: 1,
    title: "Saved Chapter",
    contentType: "text",
    publishedAt: "2026-10-31T12:00:00.000Z",
  };
  return catalogDetailDataSchema.parse({
    work: {
      slug,
      title: "Saved Work",
      alternativeTitle: null,
      type: "novel",
      storyStatus: "ongoing",
      publishedAt: "2026-10-31T12:00:00.000Z",
      categories: [{ slug: "action", displayName: "Action" }],
      coverPath: `/api/v1/content/works/${slug}/cover`,
      synopsis: "A complete saved public synopsis.",
      author: "Saved Author",
      artist: null,
      tags: [],
      backgroundPath: null,
    },
    chapters: {
      items: [chapter],
      pagination: {
        page: 1,
        limit: 25,
        total: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    },
    firstChapter: chapter,
    latestChapter: chapter,
    similar: [],
  });
};

export const publicSuccessFixture = (data: unknown) => ({
  success: true,
  statusCode: 200,
  message: "Loaded",
  data,
  requestId: "request-id",
  timestamp: "2026-10-31T12:00:00.000Z",
  path: "/content/catalog",
});
export const publicNotFoundFixture = () => ({
  success: false,
  statusCode: 404,
  code: "NOT_FOUND",
  message: "Resource not found.",
  requestId: "request-id",
  timestamp: "2026-10-31T12:00:00.000Z",
  path: "/content/catalog/works/:workSlug",
});
