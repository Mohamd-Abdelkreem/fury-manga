import {
  INITIAL_ADMIN_CHAPTERS,
  INITIAL_ADMIN_CONTACT_MESSAGES,
  INITIAL_ADMIN_METRICS,
  INITIAL_ADMIN_REPORTS,
  INITIAL_ADMIN_USERS,
  INITIAL_ADMIN_WORKS,
} from "../data/adminFixtures";
import type {
  AdminChapter,
  AdminContactMessage,
  AdminDashboardMetrics,
  AdminReport,
  AdminUser,
  AdminWork,
} from "../types/admin.types";

type DashboardRecords = {
  works: readonly AdminWork[];
  chapters: Readonly<Record<string, AdminChapter[]>>;
  users: readonly AdminUser[];
  reports: readonly AdminReport[];
  contactMessages: readonly AdminContactMessage[];
};

function publishedChapterCount(chapters: DashboardRecords["chapters"]) {
  return Object.values(chapters).reduce(
    (count, workChapters) =>
      count +
      workChapters.filter((chapter) => chapter.status === "published").length,
    0,
  );
}

function openReportCount(reports: DashboardRecords["reports"]) {
  return reports.filter(
    (report) => report.status === "open" || report.status === "under_review",
  ).length;
}

function countDelta(current: number, initial: number, baseline: number) {
  return baseline + current - initial;
}

export function deriveAdminMetrics(
  records: DashboardRecords,
): AdminDashboardMetrics {
  // The dashboard totals include records beyond the interactive fixture sample.
  return {
    publishedWorks: countDelta(
      records.works.filter((work) => work.publishStatus === "published").length,
      INITIAL_ADMIN_WORKS.filter((work) => work.publishStatus === "published")
        .length,
      INITIAL_ADMIN_METRICS.publishedWorks,
    ),
    draftWorks: countDelta(
      records.works.filter((work) => work.publishStatus === "draft").length,
      INITIAL_ADMIN_WORKS.filter((work) => work.publishStatus === "draft")
        .length,
      INITIAL_ADMIN_METRICS.draftWorks,
    ),
    publishedChapters: countDelta(
      publishedChapterCount(records.chapters),
      publishedChapterCount(INITIAL_ADMIN_CHAPTERS),
      INITIAL_ADMIN_METRICS.publishedChapters,
    ),
    activeUsers: countDelta(
      records.users.filter((user) => user.status === "active").length,
      INITIAL_ADMIN_USERS.filter((user) => user.status === "active").length,
      INITIAL_ADMIN_METRICS.activeUsers,
    ),
    openReports: countDelta(
      openReportCount(records.reports),
      openReportCount(INITIAL_ADMIN_REPORTS),
      INITIAL_ADMIN_METRICS.openReports,
    ),
    unreadMessages: countDelta(
      records.contactMessages.filter((message) => !message.isRead).length,
      INITIAL_ADMIN_CONTACT_MESSAGES.filter((message) => !message.isRead)
        .length,
      INITIAL_ADMIN_METRICS.unreadMessages,
    ),
  };
}
