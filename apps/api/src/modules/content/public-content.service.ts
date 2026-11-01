import {
  CATALOG_WORK_PAGE_SIZE,
  CATALOG_CATEGORY_PAGE_SIZE,
  type CatalogSitemapData,
  type CatalogDetailData,
  type CatalogHomeData,
  type CatalogWorkListQuery,
  type CatalogCategoryListQuery,
  type CatalogWorkListData,
  type CatalogCategoryListData,
  type PublicChapter,
  type PublicWork,
} from "@fury/contracts";
import { MediaReferenceSlot, Prisma } from "@fury/database";

import { NotFoundException } from "../../core/errors/not-found.error.js";
import {
  parsePagination,
  buildPaginationMeta,
  type PaginationQuery,
} from "../../core/pagination/index.js";
import {
  mapCatalogWorkDetail,
  mapCatalogChapter,
  mapCatalogWork,
  mapCatalogCategory,
  mapPublicChapter,
  mapPublicWork,
} from "./content.mapper.js";
import {
  findPublicChapter,
  findPublicWork,
  countPublicWorks,
  listCatalogWorks,
  countCatalogWorks,
  listCatalogCategories,
  catalogCategoryWhere,
  findPublicWorkImage,
  findCatalogWorkDetail,
  findLatestPublicChapter,
  listSimilarCatalogWorks,
  listCatalogSitemapBatch,
  listFeaturedCatalogWorks,
  listPopulatedCatalogCategories,
  listLatestCatalogReleases,
  countPublicChapters,
  listPublicChapters,
  listPublicWorks,
} from "./content.queries.js";
import { readVerifiedMedia } from "../../infrastructure/media/media-read-integrity.js";
import type { MediaStorage } from "../../infrastructure/media/media-storage.js";
import { MediaUnavailableException } from "../../infrastructure/media/media.errors.js";
import type { ContentList, PublicContentDatabase } from "./content.types.js";

export class PublicContentService {
  constructor(
    private readonly database: PublicContentDatabase,
    private readonly storage?: Pick<MediaStorage, "read">,
  ) {}

  async listWorks(
    pagination: PaginationQuery,
  ): Promise<ContentList<PublicWork>> {
    const [records, total] = await this.database.$transaction(
      async (transaction) => {
        const selected = await listPublicWorks(transaction, pagination);
        const count = await countPublicWorks(transaction);
        return [selected, count] as const;
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead },
    );
    const workList = {
      items: records.map(mapPublicWork),
      pagination: buildPaginationMeta({ ...pagination, total }),
    };
    return workList;
  }

  async getWork(slug: string): Promise<PublicWork> {
    const work = await this.database.$transaction(
      async (transaction) => {
        const record = await findPublicWork(transaction, slug);
        return record;
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead },
    );
    if (work === null) throw new NotFoundException();
    const publicWork = mapPublicWork(work);
    return publicWork;
  }

  async listCatalogWorks(
    query: CatalogWorkListQuery,
  ): Promise<CatalogWorkListData> {
    const pagination = parsePagination({
      page: query.page,
      limit: CATALOG_WORK_PAGE_SIZE,
    });
    const catalog: CatalogWorkListData = await this.database.$transaction(
      async (transaction) => {
        const records = await listCatalogWorks(transaction, query, pagination);
        const total = await countCatalogWorks(transaction, query);
        return {
          items: records.map(mapCatalogWork),
          pagination: {
            ...buildPaginationMeta({ ...pagination, total }),
            limit: CATALOG_WORK_PAGE_SIZE,
          },
        };
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead },
    );
    return catalog;
  }

  async listCatalogCategories(
    query: CatalogCategoryListQuery,
  ): Promise<CatalogCategoryListData> {
    const pagination = parsePagination({
      page: query.page,
      limit: CATALOG_CATEGORY_PAGE_SIZE,
    });
    const categories: CatalogCategoryListData =
      await this.database.$transaction(
        async (transaction) => {
          const records = await listCatalogCategories(
            transaction,
            query,
            pagination,
          );
          const total = await transaction.category.count({
            where: catalogCategoryWhere(query),
          });
          return {
            items: records.map(mapCatalogCategory),
            pagination: {
              ...buildPaginationMeta({ ...pagination, total }),
              limit: CATALOG_CATEGORY_PAGE_SIZE,
            },
          };
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead },
      );
    return categories;
  }

  async getCatalogHome(): Promise<CatalogHomeData> {
    const home: CatalogHomeData = await this.database.$transaction(
      async (transaction) => {
        const featured = await listFeaturedCatalogWorks(transaction);
        const categoryShortcuts = await listCatalogCategories(
          transaction,
          { page: 1 },
          parsePagination({ page: 1, limit: 12 }),
        );
        const releases = await listLatestCatalogReleases(transaction);
        const categories = await listPopulatedCatalogCategories(transaction);
        const suggestions: CatalogHomeData["suggestions"] = [];
        for (const category of categories) {
          const works = await listCatalogWorks(
            transaction,
            { view: "all", sort: "newest", page: 1, category: category.slug },
            parsePagination({ page: 1, limit: 6 }),
          );
          suggestions.push({
            category: mapCatalogCategory(category),
            works: works.map(mapCatalogWork),
          });
        }
        return {
          featured: featured.map(mapCatalogWork),
          categoryShortcuts: categoryShortcuts.map(mapCatalogCategory),
          latestReleases: releases.map((release) => ({
            work: mapCatalogWork(release.work),
            chapter: mapCatalogChapter(release.chapter),
          })),
          suggestions,
        };
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead },
    );
    return home;
  }

  async getCatalogSitemap(): Promise<CatalogSitemapData> {
    const sitemap: CatalogSitemapData = await this.database.$transaction(
      async (transaction) => {
        const items: CatalogSitemapData["items"] = [];
        let afterId: string | undefined;
        let hasMore: boolean;
        do {
          const batch = await listCatalogSitemapBatch(transaction, afterId);
          items.push(...batch.map((work) => ({ slug: work.slug })));
          afterId = batch.at(-1)?.id;
          hasMore = batch.length === 100;
        } while (hasMore);
        return { items };
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead },
    );
    return sitemap;
  }

  async getCatalogDetail(slug: string): Promise<CatalogDetailData> {
    const detail: CatalogDetailData = await this.database.$transaction(
      async (transaction) => {
        const work = await findCatalogWorkDetail(transaction, slug);
        if (work === null) throw new NotFoundException();
        const pagination = parsePagination({ page: 1, limit: 25 });
        const chapters = await listPublicChapters(
          transaction,
          work.id,
          pagination,
        );
        const total = await countPublicChapters(transaction, work.id);
        const latest = await findLatestPublicChapter(transaction, work.id);
        const similar = await listSimilarCatalogWorks(transaction, work.id);
        const first = chapters[0];
        return {
          work: mapCatalogWorkDetail(work),
          chapters: {
            items: chapters.map(mapCatalogChapter),
            pagination: {
              ...buildPaginationMeta({ ...pagination, total }),
              page: 1,
              limit: 25,
            },
          },
          firstChapter: first === undefined ? null : mapCatalogChapter(first),
          latestChapter: latest === null ? null : mapCatalogChapter(latest),
          similar: similar.map(mapCatalogWork),
        };
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead },
    );
    return detail;
  }

  async getCover(
    slug: string,
  ): Promise<{ bytes: Buffer; contentType: string }> {
    const image = await this.readWorkImage(slug, MediaReferenceSlot.WORK_COVER);
    return image;
  }

  async getBackground(
    slug: string,
  ): Promise<{ bytes: Buffer; contentType: string }> {
    const image = await this.readWorkImage(
      slug,
      MediaReferenceSlot.WORK_BACKGROUND,
    );
    return image;
  }

  async listChapters(
    workSlug: string,
    pagination: PaginationQuery,
  ): Promise<ContentList<PublicChapter>> {
    const [records, total] = await this.database.$transaction(
      async (transaction) => {
        const work = await findPublicWork(transaction, workSlug);
        if (work === null) throw new NotFoundException();
        const selected = await listPublicChapters(
          transaction,
          work.id,
          pagination,
        );
        const count = await countPublicChapters(transaction, work.id);
        return [selected, count] as const;
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead },
    );
    const chapterList = {
      items: records.map(mapPublicChapter),
      pagination: buildPaginationMeta({ ...pagination, total }),
    };
    return chapterList;
  }

  async getChapter(
    workSlug: string,
    chapterNumber: number,
  ): Promise<PublicChapter> {
    const chapter = await this.database.$transaction(
      async (transaction) => {
        const work = await findPublicWork(transaction, workSlug);
        if (work === null) throw new NotFoundException();
        const record = await findPublicChapter(
          transaction,
          work.id,
          chapterNumber,
        );
        return record;
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead },
    );
    if (chapter === null) throw new NotFoundException();
    const publicChapter = mapPublicChapter(chapter);
    return publicChapter;
  }
  // Helper methods
  private async readWorkImage(
    slug: string,
    slot: "WORK_COVER" | "WORK_BACKGROUND",
  ): Promise<{ bytes: Buffer; contentType: string }> {
    const asset = await this.database.$transaction(
      async (transaction) => {
        const record = await findPublicWorkImage(transaction, slug, slot);
        return record;
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead },
    );
    if (asset === null) throw new NotFoundException();
    if (this.storage === undefined || asset.contentType === null)
      throw new MediaUnavailableException();
    const bytes = await readVerifiedMedia(this.storage, asset);
    const image = { bytes, contentType: asset.contentType };
    return image;
  }
}
