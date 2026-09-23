import type { PublicChapter, PublicWork } from "@fury/contracts";
import { PublicationStatus, type DatabaseClient } from "@fury/database";

import { NotFoundException } from "../../core/errors/not-found.error.js";
import {
  buildPaginationMeta,
  type PaginationQuery,
} from "../../core/pagination/index.js";
import { mapPublicChapter, mapPublicWork } from "./content.mapper.js";
import {
  findPublicChapter,
  findPublicWork,
  listPublicChapters,
  listPublicWorks,
} from "./content.queries.js";
import type { ContentList } from "./content.types.js";

export class PublicContentService {
  constructor(private readonly database: DatabaseClient) {}

  async listWorks(
    pagination: PaginationQuery,
  ): Promise<ContentList<PublicWork>> {
    const [records, total] = await this.database.$transaction(
      async (transaction) =>
        Promise.all([
          listPublicWorks(transaction, pagination),
          transaction.work.count({
            where: { publicationStatus: PublicationStatus.PUBLISHED },
          }),
        ]),
    );
    const workList = {
      items: records.map(mapPublicWork),
      pagination: buildPaginationMeta({ ...pagination, total }),
    };
    return workList;
  }

  async getWork(slug: string): Promise<PublicWork> {
    const work = await findPublicWork(this.database, slug);
    if (work === null) throw new NotFoundException();
    const publicWork = mapPublicWork(work);
    return publicWork;
  }

  async listChapters(
    workSlug: string,
    pagination: PaginationQuery,
  ): Promise<ContentList<PublicChapter>> {
    const work = await findPublicWork(this.database, workSlug);
    if (work === null) throw new NotFoundException();
    const [records, total] = await this.database.$transaction(
      async (transaction) =>
        Promise.all([
          listPublicChapters(transaction, work.id, pagination),
          transaction.chapter.count({
            where: {
              workId: work.id,
              publicationStatus: PublicationStatus.PUBLISHED,
            },
          }),
        ]),
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
    const work = await findPublicWork(this.database, workSlug);
    if (work === null) throw new NotFoundException();
    const chapter = await findPublicChapter(
      this.database,
      work.id,
      chapterNumber,
    );
    if (chapter === null) throw new NotFoundException();
    const publicChapter = mapPublicChapter(chapter);
    return publicChapter;
  }
}
