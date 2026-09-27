import type { PaginationQuery } from "../../core/pagination/pagination.js";
import type {
  AdminChapterListQuery,
  AdminWorkListQuery,
} from "@fury/contracts";
import { MediaAssetStatus, Prisma, PublicationStatus } from "@fury/database";

import {
  CATEGORY_SELECT,
  CHAPTER_SELECT,
  CHAPTER_SUMMARY_SELECT,
  PUBLIC_CHAPTER_SELECT,
  PUBLIC_WORK_SELECT,
  WORK_SELECT,
  WORK_LIST_SELECT,
  type CategoryRecord,
  type ChapterRecord,
  type ChapterSummaryRecord,
  type PublicChapterRecord,
  type PublicWorkRecord,
  type WorkRecord,
  type WorkListRecord,
} from "./content.mapper.js";
import {
  toDatabasePublicationStatus,
  toDatabaseStoryStatus,
  toDatabaseWorkType,
  type WorkReadinessInput,
} from "./content.rules.js";

export type ContentReadClient = Pick<
  Prisma.TransactionClient,
  "category" | "chapter" | "work"
>;

export type CategoryListFilters = Readonly<{
  search?: string | undefined;
  enabled?: boolean | undefined;
}>;

export const buildCategoryWhere = (
  filters: CategoryListFilters,
): Prisma.CategoryWhereInput => ({
  ...(filters.enabled === undefined ? {} : { enabled: filters.enabled }),
  ...(filters.search === undefined || filters.search.length === 0
    ? {}
    : {
        OR: [
          { displayName: { contains: filters.search, mode: "insensitive" } },
          { slug: { contains: filters.search, mode: "insensitive" } },
        ],
      }),
});

export const lockCategoryEligibilityState = async (
  transaction: Prisma.TransactionClient,
): Promise<void> => {
  await transaction.$queryRaw`
    SELECT pg_advisory_xact_lock(5380033990110::BIGINT) IS NULL AS "locked"
  `;
};

export const lockCategoryOrder = async (
  transaction: Prisma.TransactionClient,
): Promise<void> => {
  await transaction.$queryRaw`
    SELECT pg_advisory_xact_lock(5380033990109::BIGINT) IS NULL AS "locked"
  `;
};

export const findAdminCategory = (
  database: ContentReadClient,
  categoryId: string,
): Promise<CategoryRecord | null> =>
  database.category.findUnique({
    where: { id: categoryId },
    select: CATEGORY_SELECT,
  });

export const findAdminWork = (
  database: ContentReadClient,
  workId: string,
): Promise<WorkRecord | null> =>
  database.work.findUnique({
    where: { id: workId },
    select: WORK_SELECT,
  });

export const readWorkReadiness = async (
  transaction: Prisma.TransactionClient,
  record: WorkRecord,
): Promise<WorkReadinessInput> => {
  const coverAssetId = record.mediaReferences.find(
    ({ slot }) => slot === "WORK_COVER",
  )?.assetId;
  const availableCover =
    coverAssetId === undefined
      ? null
      : await transaction.mediaAsset.findFirst({
          where: {
            id: coverAssetId,
            status: MediaAssetStatus.AVAILABLE,
            mediaClass: "WORK_COVER",
            scope: "ADMIN",
          },
          select: { id: true },
        });
  return {
    title: record.title,
    synopsis: record.synopsis,
    author: record.author,
    enabledCategoryCount: record.categories.filter(
      ({ category }) => category.enabled,
    ).length,
    hasAvailableCover: availableCover !== null,
  };
};

export const findPublishedFeaturedWork = (
  transaction: Prisma.TransactionClient,
  featuredOrder: number,
  excludingWorkId?: string,
): Promise<{ id: string } | null> =>
  transaction.work.findFirst({
    where: {
      publicationStatus: PublicationStatus.PUBLISHED,
      featuredHome: true,
      featuredOrder,
      ...(excludingWorkId === undefined
        ? {}
        : { id: { not: excludingWorkId } }),
    },
    select: { id: true },
  });

export const findAdminChapter = (
  database: ContentReadClient,
  workId: string,
  chapterId: string,
): Promise<ChapterRecord | null> =>
  database.chapter.findFirst({
    where: { id: chapterId, workId },
    select: CHAPTER_SELECT,
  });

export const listAdminCategories = (
  database: ContentReadClient,
  pagination: PaginationQuery,
  filters: CategoryListFilters = {},
): Promise<CategoryRecord[]> =>
  database.category.findMany({
    where: buildCategoryWhere(filters),
    orderBy: [{ displayPosition: "asc" }, { id: "asc" }],
    skip: pagination.skip,
    take: pagination.take,
    select: CATEGORY_SELECT,
  });

export const listAdminWorks = (
  database: ContentReadClient,
  pagination: PaginationQuery,
  query: AdminWorkListQuery,
): Promise<WorkListRecord[]> =>
  database.work.findMany({
    where: buildAdminWorkWhere(query),
    orderBy: adminWorkOrder(query.sort),
    skip: pagination.skip,
    take: pagination.take,
    select: WORK_LIST_SELECT,
  });

export const buildAdminWorkWhere = (
  query: AdminWorkListQuery,
): Prisma.WorkWhereInput => ({
  ...(query.search === undefined || query.search.length === 0
    ? {}
    : {
        OR: [
          { title: { contains: query.search, mode: "insensitive" as const } },
          {
            alternativeTitle: {
              contains: query.search,
              mode: "insensitive" as const,
            },
          },
        ],
      }),
  ...(query.type === undefined ? {} : { type: toDatabaseWorkType(query.type) }),
  ...(query.storyStatus === undefined
    ? {}
    : { storyStatus: toDatabaseStoryStatus(query.storyStatus) }),
  ...(query.publicationStatus === undefined
    ? {}
    : {
        publicationStatus: toDatabasePublicationStatus(query.publicationStatus),
      }),
});

const adminWorkOrder = (
  sort: AdminWorkListQuery["sort"],
): Prisma.WorkOrderByWithRelationInput[] => {
  switch (sort) {
    case "oldest":
      return [{ createdAt: "asc" }, { id: "asc" }];
    case "title":
      return [{ title: "asc" }, { id: "asc" }];
    case "chapters":
      return [{ chapters: { _count: "desc" } }, { id: "asc" }];
    case "updated":
      return [{ updatedAt: "desc" }, { id: "asc" }];
  }
};

export const buildAdminChapterWhere = (
  workId: string,
  query: AdminChapterListQuery,
): Prisma.ChapterWhereInput => {
  const search = query.search ?? "";
  const numericSearch = /^(?:[1-9]\d*)$/u.test(search) ? Number(search) : null;
  return {
    workId,
    ...(query.publicationStatus === undefined
      ? {}
      : {
          publicationStatus: toDatabasePublicationStatus(
            query.publicationStatus,
          ),
        }),
    ...(search.length === 0
      ? {}
      : {
          OR: [
            { title: { contains: search, mode: "insensitive" as const } },
            ...(numericSearch !== null && numericSearch <= 2_147_483_647
              ? [{ number: numericSearch }]
              : []),
          ],
        }),
  };
};

const adminChapterOrder = (
  sort: AdminChapterListQuery["sort"],
): Prisma.ChapterOrderByWithRelationInput[] => {
  switch (sort) {
    case "number_asc":
      return [{ number: "asc" }, { id: "asc" }];
    case "number_desc":
      return [{ number: "desc" }, { id: "asc" }];
    case "published_desc":
      return [{ publishedAt: { sort: "desc", nulls: "last" } }, { id: "asc" }];
    case "updated_desc":
      return [{ updatedAt: "desc" }, { id: "asc" }];
  }
};

export const listAdminChapterSummaries = (
  database: ContentReadClient,
  workId: string,
  pagination: PaginationQuery,
  query: AdminChapterListQuery,
): Promise<ChapterSummaryRecord[]> =>
  database.chapter.findMany({
    where: buildAdminChapterWhere(workId, query),
    orderBy: adminChapterOrder(query.sort),
    skip: pagination.skip,
    take: pagination.take,
    select: CHAPTER_SUMMARY_SELECT,
  });

const jsonArray = (value: Prisma.Sql): Prisma.Sql => Prisma.sql`
  CASE WHEN jsonb_typeof(${value}) = 'array' THEN ${value} ELSE '[]'::jsonb END
`;

const jsonObject = (value: Prisma.Sql): Prisma.Sql => Prisma.sql`
  CASE WHEN jsonb_typeof(${value}) = 'object' THEN ${value} ELSE '{}'::jsonb END
`;

const hasOnlyKeys = (value: Prisma.Sql, keys: readonly string[]): Prisma.Sql =>
  Prisma.sql`NOT EXISTS (
    SELECT 1 FROM jsonb_object_keys(${jsonObject(value)}) AS field(key)
    WHERE field.key NOT IN (${Prisma.join(keys)})
  )`;

const utf16LengthAtMost = (value: Prisma.Sql, maximum: number): Prisma.Sql =>
  Prisma.sql`CASE
    WHEN length(${value}) > ${maximum} THEN false
    WHEN octet_length(${value}) = length(${value}) THEN true
    ELSE length(${value}) + (
      SELECT count(*) FROM regexp_matches(${value}, '[\\s\\S]', 'g') AS glyph(characters)
      WHERE ascii((glyph.characters)[1]) > 65535
    ) <= ${maximum}
  END`;

const safeTextLeaf = (value: Prisma.Sql): Prisma.Sql => {
  const leaf = Prisma.sql`(${value} #>> '{}')`;
  return Prisma.sql`
    jsonb_typeof(${value}) = 'string'
    AND length(${leaf}) >= 1 AND ${utf16LengthAtMost(leaf, 4000)}
    AND replace(replace(replace(replace(${leaf}, chr(9), ''), chr(10), ''), chr(13), ''), chr(127), '') !~ '[[:cntrl:]]'
  `;
};

const safeHref = (value: Prisma.Sql): Prisma.Sql => {
  const href = Prisma.sql`(${value} #>> '{}')`;
  return Prisma.sql`
    jsonb_typeof(${value}) = 'string'
    AND length(${href}) >= 1 AND ${utf16LengthAtMost(href, 2048)}
    AND left(${href}, 1) = '/' AND left(${href}, 2) <> '//'
    AND strpos(${href}, chr(92)) = 0 AND ${href} !~ '[[:cntrl:]]'
  `;
};

const inline = Prisma.sql`inline_node.value`;
const block = Prisma.sql`block.value`;
const inlineReady = Prisma.sql`
  jsonb_typeof(${inline}) = 'object'
  AND ${hasOnlyKeys(inline, ["text", "bold", "italic", "href"])}
  AND ${safeTextLeaf(Prisma.sql`${inline}->'text'`)}
  AND (NOT ${inline} ? 'bold' OR jsonb_typeof(${inline}->'bold') = 'boolean')
  AND (NOT ${inline} ? 'italic' OR jsonb_typeof(${inline}->'italic') = 'boolean')
  AND (NOT ${inline} ? 'href' OR ${safeHref(Prisma.sql`${inline}->'href'`)})
`;

const headingReady = Prisma.sql`
  ${hasOnlyKeys(block, ["type", "level", "text"])}
  AND ${block}->'level' IN ('2'::jsonb, '3'::jsonb)
  AND ${safeTextLeaf(Prisma.sql`${block}->'text'`)}
`;

const paragraphContent = Prisma.sql`${block}->'content'`;
const paragraphReady = Prisma.sql`
  ${hasOnlyKeys(block, ["type", "content"])}
  AND jsonb_typeof(${paragraphContent}) = 'array'
  AND jsonb_array_length(${jsonArray(paragraphContent)}) BETWEEN 1 AND 200
  AND NOT EXISTS (
    SELECT 1 FROM jsonb_array_elements(${jsonArray(paragraphContent)}) AS inline_node(value)
    WHERE (${inlineReady}) IS NOT TRUE
  )
`;

const listItems = Prisma.sql`${block}->'items'`;
const listReady = Prisma.sql`
  ${hasOnlyKeys(block, ["type", "ordered", "items"])}
  AND jsonb_typeof(${block}->'ordered') = 'boolean'
  AND jsonb_typeof(${listItems}) = 'array'
  AND jsonb_array_length(${jsonArray(listItems)}) BETWEEN 1 AND 200
  AND NOT EXISTS (
    SELECT 1 FROM jsonb_array_elements(${jsonArray(listItems)}) AS list_item(value)
    WHERE (${safeTextLeaf(Prisma.sql`list_item.value`)}) IS NOT TRUE
  )
`;

const TEXT_DOCUMENT_READY_SQL = Prisma.sql`
  jsonb_typeof(c.text_content) = 'object'
  AND ${hasOnlyKeys(Prisma.sql`c.text_content`, ["version", "blocks"])}
  AND c.text_content->'version' = '1'::jsonb
  AND jsonb_typeof(c.text_content->'blocks') = 'array'
  AND jsonb_array_length(${jsonArray(Prisma.sql`c.text_content->'blocks'`)}) BETWEEN 1 AND 500
  AND octet_length(c.text_content::text) <= 524288
  AND NOT EXISTS (
    SELECT 1 FROM jsonb_array_elements(${jsonArray(Prisma.sql`c.text_content->'blocks'`)}) AS block(value)
    WHERE (jsonb_typeof(${block}) = 'object' AND CASE ${block}->>'type'
      WHEN 'heading' THEN ${headingReady}
      WHEN 'paragraph' THEN ${paragraphReady}
      WHEN 'list' THEN ${listReady}
      ELSE false END) IS NOT TRUE
  )
`;

const CHAPTER_READY_SQL = Prisma.sql`
  (c.title IS NOT NULL AND btrim(c.title) <> '' AND c.number > 0 AND
        CASE WHEN c.content_type = 'text' THEN
          ${TEXT_DOCUMENT_READY_SQL}
        WHEN c.content_type = 'illustrated' THEN EXISTS (SELECT 1 FROM chapter_pages p
          WHERE p.chapter_id = c.id AND p.retired_at IS NULL)
          AND NOT EXISTS (SELECT 1 FROM chapter_pages p
            WHERE p.chapter_id = c.id AND p.retired_at IS NULL AND
              (p.position < 1 OR
                (SELECT count(*) FROM media_references r
                  WHERE r.chapter_page_id = p.id AND r.retired_at IS NULL) <> 1 OR
                NOT EXISTS (SELECT 1 FROM media_references r
                  JOIN media_assets a ON a.id = r.asset_id
                  WHERE r.chapter_page_id = p.id AND r.retired_at IS NULL
                    AND r.slot = 'chapter_page' AND a.media_class = 'chapter_page'
                    AND a.scope = 'admin' AND a.status = 'available')))
          AND (SELECT count(*) FROM chapter_pages p
            WHERE p.chapter_id = c.id AND p.retired_at IS NULL) BETWEEN 1 AND 500
          AND (SELECT count(*) FROM chapter_pages p
            WHERE p.chapter_id = c.id AND p.retired_at IS NULL) =
              (SELECT max(p.position) FROM chapter_pages p
                WHERE p.chapter_id = c.id AND p.retired_at IS NULL)
        ELSE false
        END)
`;

export const readChapterSummaryReadiness = async (
  transaction: Prisma.TransactionClient,
  chapterIds: readonly string[],
): Promise<Map<string, boolean>> => {
  if (chapterIds.length === 0) return new Map();
  const ids = Prisma.join(chapterIds.map((id) => Prisma.sql`${id}::uuid`));
  const rows = await transaction.$queryRaw<{ id: string; ready: boolean }[]>`
    SELECT c.id, ${CHAPTER_READY_SQL} AS ready
    FROM chapters c WHERE c.id IN (${ids})
  `;
  return new Map(rows.map(({ id, ready }) => [id, ready]));
};

export const PUBLIC_READY_WORK_WHERE = {
  publicationStatus: PublicationStatus.PUBLISHED,
  synopsis: { not: null },
  author: { not: null },
  categories: { some: { category: { enabled: true } } },
  mediaReferences: {
    some: {
      slot: "WORK_COVER",
      retiredAt: null,
      asset: {
        mediaClass: "WORK_COVER",
        scope: "ADMIN",
        status: MediaAssetStatus.AVAILABLE,
      },
    },
  },
} satisfies Prisma.WorkWhereInput;

const PUBLIC_READY_CHAPTER_SQL = Prisma.sql`
  c.publication_status = 'published'
  AND c.published_at IS NOT NULL
  AND c.current_publication_event_id IS NOT NULL
  AND ${CHAPTER_READY_SQL}
`;

export const listPublicWorks = (
  database: ContentReadClient,
  pagination: PaginationQuery,
): Promise<PublicWorkRecord[]> =>
  database.work.findMany({
    where: PUBLIC_READY_WORK_WHERE,
    orderBy: [{ publishedAt: "desc" }, { id: "asc" }],
    skip: pagination.skip,
    take: pagination.take,
    select: PUBLIC_WORK_SELECT,
  });

export const findPublicWork = (
  database: ContentReadClient,
  slug: string,
): Promise<PublicWorkRecord | null> =>
  database.work.findFirst({
    where: { AND: [PUBLIC_READY_WORK_WHERE, { slug }] },
    select: PUBLIC_WORK_SELECT,
  });

export const countPublicChapters = async (
  transaction: Prisma.TransactionClient,
  workId: string,
): Promise<number> => {
  const rows = await transaction.$queryRaw<{ total: bigint }[]>`
    SELECT count(*) AS total FROM chapters c
    WHERE c.work_id = ${workId}::uuid AND ${PUBLIC_READY_CHAPTER_SQL}
  `;
  return Number(rows[0]?.total ?? 0n);
};

export const listPublicChapters = async (
  transaction: Prisma.TransactionClient,
  workId: string,
  pagination: PaginationQuery,
): Promise<PublicChapterRecord[]> => {
  const ids = await transaction.$queryRaw<{ id: string }[]>`
    SELECT c.id FROM chapters c
    WHERE c.work_id = ${workId}::uuid AND ${PUBLIC_READY_CHAPTER_SQL}
    ORDER BY c.number ASC, c.id ASC
    OFFSET ${pagination.skip} LIMIT ${pagination.take}
  `;
  if (ids.length === 0) return [];
  const rows = await transaction.chapter.findMany({
    where: { id: { in: ids.map(({ id }) => id) } },
    select: PUBLIC_CHAPTER_SELECT,
  });
  const byId = new Map(rows.map((row) => [row.id, row]));
  return ids.map(({ id }) => {
    const chapter = byId.get(id);
    if (chapter === undefined)
      throw new Error("Public Chapter snapshot changed.");
    return chapter;
  });
};

export const findPublicChapter = async (
  transaction: Prisma.TransactionClient,
  workId: string,
  number: number,
): Promise<PublicChapterRecord | null> => {
  const ids = await transaction.$queryRaw<{ id: string }[]>`
    SELECT c.id FROM chapters c
    WHERE c.work_id = ${workId}::uuid AND c.number = ${number}
      AND ${PUBLIC_READY_CHAPTER_SQL}
    LIMIT 1
  `;
  const id = ids[0]?.id;
  if (id === undefined) return null;
  return transaction.chapter.findUnique({
    where: { id },
    select: PUBLIC_CHAPTER_SELECT,
  });
};
