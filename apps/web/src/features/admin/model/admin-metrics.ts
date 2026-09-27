import {
  INITIAL_ADMIN_CONTACT_MESSAGES,
  INITIAL_ADMIN_METRICS,
  INITIAL_ADMIN_REPORTS,
  INITIAL_ADMIN_USERS,
} from "../data/adminFixtures";
import type {
  AdminContactMessage,
  AdminDashboardMetrics,
  AdminReport,
  AdminUser,
} from "../types/admin.types";

type DashboardRecords = {
  users: readonly AdminUser[];
  reports: readonly AdminReport[];
  contactMessages: readonly AdminContactMessage[];
};

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
    publishedChapters: INITIAL_ADMIN_METRICS.publishedChapters,
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
