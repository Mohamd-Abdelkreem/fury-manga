"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  INITIAL_ADMIN_ACTIVITY,
  INITIAL_ADMIN_AD_PLACEMENTS,
  INITIAL_ADMIN_CHAPTERS,
  INITIAL_ADMIN_COMMENTS,
  INITIAL_ADMIN_CONTACT_MESSAGES,
  INITIAL_ADMIN_GIFTS,
  INITIAL_ADMIN_GIFT_GRANTS,
  INITIAL_ADMIN_GLOBAL_ADS,
  INITIAL_ADMIN_REPORTS,
  INITIAL_ADMIN_USER,
  INITIAL_ADMIN_USERS,
  INITIAL_ADMIN_USER_DETAILS,
  INITIAL_ADMIN_WORKS,
} from "../data/adminFixtures";
import type {
  AdminActivityEvent,
  AdminAdPlacement,
  AdminChapter,
  AdminComment,
  AdminContactMessage,
  AdminContactStatus,
  AdminDashboardMetrics,
  AdminGiftDesign,
  AdminGiftGrantRecord,
  AdminReport,
  AdminReportResolution,
  AdminReportStatus,
  AdminUser,
  AdminUserDetail,
  AdminUserSummary,
  AdminWork,
} from "../types/admin.types";
import type { TextBlock } from "../../text-stories/data/textStories";
import { useAdminWorkActions } from "../hooks/use-admin-work-actions";
import { useAdminUserActions } from "../hooks/use-admin-user-actions";
import { useAdminGiftActions } from "../hooks/use-admin-gift-actions";
import { useAdminModerationActions } from "../hooks/use-admin-moderation-actions";
import { useAdminContactActions } from "../hooks/use-admin-contact-actions";
import { useAdminAdActions } from "../hooks/use-admin-ad-actions";
import { deriveAdminMetrics } from "../model/admin-metrics";

interface AdminContextType {
  works: AdminWork[];
  chapters: Record<string, AdminChapter[]>;
  metrics: AdminDashboardMetrics;
  activities: AdminActivityEvent[];
  user: AdminUserSummary;
  users: AdminUser[];
  gifts: AdminGiftDesign[];
  grantRecords: AdminGiftGrantRecord[];
  comments: AdminComment[];
  reports: AdminReport[];
  contactMessages: AdminContactMessage[];
  adPlacements: AdminAdPlacement[];
  globalAdsEnabled: boolean;

  getWork: (id: string) => AdminWork | undefined;
  getChapters: (workId: string) => AdminChapter[];
  getChapter: (workId: string, chapterId: string) => AdminChapter | undefined;
  createWork: (
    workData: Omit<
      AdminWork,
      "id" | "createdAt" | "updatedAt" | "chapterCount" | "views"
    >,
  ) => AdminWork;
  updateWork: (
    id: string,
    updates: Partial<Omit<AdminWork, "id" | "createdAt">>,
  ) => AdminWork | undefined;
  toggleWorkPublish: (id: string) => void;
  archiveWork: (id: string) => void;
  restoreWork: (id: string) => void;

  createChapter: (
    workId: string,
    chapterData: Omit<
      AdminChapter,
      "id" | "workId" | "views" | "publishedAt" | "updatedAt"
    > & {
      pages?: string[] | undefined;
      textContent?: string | undefined;
      textBlocks?: TextBlock[] | undefined;
    },
  ) => AdminChapter;
  updateChapter: (
    workId: string,
    chapterId: string,
    updates: Partial<AdminChapter>,
  ) => AdminChapter | undefined;
  toggleChapterPublish: (workId: string, chapterId: string) => void;
  archiveChapter: (workId: string, chapterId: string) => void;
  restoreChapter: (workId: string, chapterId: string) => void;

  getUser: (userId: string) => AdminUserDetail | undefined;
  suspendUser: (userId: string, reason: string) => void;
  reactivateUser: (userId: string) => void;

  getGift: (giftId: string) => AdminGiftDesign | undefined;
  createGift: (
    giftData: Omit<AdminGiftDesign, "id" | "createdAt" | "recipientCount">,
  ) => AdminGiftDesign;
  updateGift: (
    giftId: string,
    updates: Partial<AdminGiftDesign>,
  ) => AdminGiftDesign | undefined;
  toggleGiftStatus: (giftId: string) => void;

  grantGiftToUser: (params: {
    giftId: string;
    userId: string;
    reason: string;
    notificationTitle: string;
    notificationBody: string;
  }) => AdminGiftGrantRecord;
  bulkGrantGift: (params: {
    giftId: string;
    reason: string;
    notificationTitle: string;
    notificationBody: string;
  }) => { grantedCount: number; records: AdminGiftGrantRecord[] };
  revokeGiftFromUser: (userId: string, giftId: string) => void;

  getComment: (commentId: string) => AdminComment | undefined;
  hideComment: (commentId: string, reason?: string) => void;
  restoreComment: (commentId: string) => void;

  getReport: (reportId: string) => AdminReport | undefined;
  getReportsForComment: (commentId: string) => AdminReport[];
  updateReportStatus: (
    reportId: string,
    status: AdminReportStatus,
    resolutionOutcome?: AdminReportResolution,
    resolutionNote?: string,
  ) => void;
  resolveRelatedReports: (
    commentId: string,
    resolutionOutcome: AdminReportResolution,
    resolutionNote?: string,
  ) => void;
  dismissReport: (reportId: string, notes?: string) => void;

  getContactMessage: (messageId: string) => AdminContactMessage | undefined;
  markContactRead: (messageId: string) => void;
  updateContactStatus: (messageId: string, status: AdminContactStatus) => void;
  updateContactInternalNote: (messageId: string, note: string) => void;

  toggleGlobalAds: () => void;
  updateAdPlacement: (
    id: string,
    updates: Partial<AdminAdPlacement>,
  ) => AdminAdPlacement | undefined;

  resetToFixtures: () => void;
}

const AdminContext = createContext<AdminContextType | null>(null);

export function AdminDataProvider({ children }: { children: ReactNode }) {
  const [works, setWorks] = useState<AdminWork[]>(INITIAL_ADMIN_WORKS);
  const [chapters, setChapters] = useState<Record<string, AdminChapter[]>>(
    INITIAL_ADMIN_CHAPTERS,
  );
  const [activities, setActivities] = useState<AdminActivityEvent[]>(
    INITIAL_ADMIN_ACTIVITY,
  );
  const [users, setUsers] = useState<AdminUser[]>(INITIAL_ADMIN_USERS);
  const [userDetails, setUserDetails] = useState<
    Record<string, AdminUserDetail>
  >(INITIAL_ADMIN_USER_DETAILS);
  const [gifts, setGifts] = useState<AdminGiftDesign[]>(INITIAL_ADMIN_GIFTS);
  const [grantRecords, setGrantRecords] = useState<AdminGiftGrantRecord[]>(
    INITIAL_ADMIN_GIFT_GRANTS,
  );
  const [comments, setComments] = useState<AdminComment[]>(
    INITIAL_ADMIN_COMMENTS,
  );
  const [reports, setReports] = useState<AdminReport[]>(INITIAL_ADMIN_REPORTS);
  const [contactMessages, setContactMessages] = useState<AdminContactMessage[]>(
    INITIAL_ADMIN_CONTACT_MESSAGES,
  );
  const [adPlacements, setAdPlacements] = useState<AdminAdPlacement[]>(
    INITIAL_ADMIN_AD_PLACEMENTS,
  );
  const [globalAdsEnabled, setGlobalAdsEnabled] = useState<boolean>(
    INITIAL_ADMIN_GLOBAL_ADS,
  );

  const metrics = useMemo(
    () =>
      deriveAdminMetrics({ works, chapters, users, reports, contactMessages }),
    [works, chapters, users, reports, contactMessages],
  );

  const user = INITIAL_ADMIN_USER;

  const {
    getWork,
    getChapters,
    getChapter,
    createWork,
    updateWork,
    toggleWorkPublish,
    archiveWork,
    restoreWork,
    createChapter,
    updateChapter,
    toggleChapterPublish,
    archiveChapter,
    restoreChapter,
  } = useAdminWorkActions({
    works,
    setWorks,
    chapters,
    setChapters,
    setActivities,
    actorName: user.name,
  });

  const { getUser, suspendUser, reactivateUser } = useAdminUserActions({
    setUsers,
    userDetails,
    setUserDetails,
    setActivities,
    actorName: user.name,
  });

  const {
    getGift,
    createGift,
    updateGift,
    toggleGiftStatus,
    grantGiftToUser,
    bulkGrantGift,
    revokeGiftFromUser,
  } = useAdminGiftActions({
    gifts,
    setGifts,
    users,
    setUsers,
    userDetails,
    setUserDetails,
    setGrantRecords,
    setActivities,
    actorName: user.name,
  });

  const {
    getComment,
    hideComment,
    restoreComment,
    getReport,
    getReportsForComment,
    updateReportStatus,
    resolveRelatedReports,
    dismissReport,
  } = useAdminModerationActions({
    comments,
    setComments,
    reports,
    setReports,
    setActivities,
    actorName: user.name,
  });

  const {
    getContactMessage,
    markContactRead,
    updateContactStatus,
    updateContactInternalNote,
  } = useAdminContactActions({ contactMessages, setContactMessages });

  const { toggleGlobalAds, updateAdPlacement } = useAdminAdActions({
    globalAdsEnabled,
    setGlobalAdsEnabled,
    adPlacements,
    setAdPlacements,
    setActivities,
    actorName: user.name,
  });

  const resetToFixtures = useCallback((): void => {
    setWorks(INITIAL_ADMIN_WORKS);
    setChapters(INITIAL_ADMIN_CHAPTERS);
    setActivities(INITIAL_ADMIN_ACTIVITY);
    setUsers(INITIAL_ADMIN_USERS);
    setUserDetails(INITIAL_ADMIN_USER_DETAILS);
    setGifts(INITIAL_ADMIN_GIFTS);
    setGrantRecords(INITIAL_ADMIN_GIFT_GRANTS);
    setComments(INITIAL_ADMIN_COMMENTS);
    setReports(INITIAL_ADMIN_REPORTS);
    setContactMessages(INITIAL_ADMIN_CONTACT_MESSAGES);
    setAdPlacements(INITIAL_ADMIN_AD_PLACEMENTS);
    setGlobalAdsEnabled(INITIAL_ADMIN_GLOBAL_ADS);
  }, []);

  const value = useMemo(
    () => ({
      works,
      chapters,
      metrics,
      activities,
      user,
      users,
      gifts,
      grantRecords,
      comments,
      reports,
      contactMessages,
      adPlacements,
      globalAdsEnabled,
      getWork,
      getChapters,
      getChapter,
      createWork,
      updateWork,
      toggleWorkPublish,
      archiveWork,
      restoreWork,
      createChapter,
      updateChapter,
      toggleChapterPublish,
      archiveChapter,
      restoreChapter,
      getUser,
      suspendUser,
      reactivateUser,
      getGift,
      createGift,
      updateGift,
      toggleGiftStatus,
      grantGiftToUser,
      bulkGrantGift,
      revokeGiftFromUser,
      getComment,
      hideComment,
      restoreComment,
      getReport,
      getReportsForComment,
      updateReportStatus,
      resolveRelatedReports,
      dismissReport,
      getContactMessage,
      markContactRead,
      updateContactStatus,
      updateContactInternalNote,
      toggleGlobalAds,
      updateAdPlacement,
      resetToFixtures,
    }),
    [
      works,
      chapters,
      metrics,
      activities,
      user,
      users,
      gifts,
      grantRecords,
      comments,
      reports,
      contactMessages,
      adPlacements,
      globalAdsEnabled,
      getWork,
      getChapters,
      getChapter,
      createWork,
      updateWork,
      toggleWorkPublish,
      archiveWork,
      restoreWork,
      createChapter,
      updateChapter,
      toggleChapterPublish,
      archiveChapter,
      restoreChapter,
      getUser,
      suspendUser,
      reactivateUser,
      getGift,
      createGift,
      updateGift,
      toggleGiftStatus,
      grantGiftToUser,
      bulkGrantGift,
      revokeGiftFromUser,
      getComment,
      hideComment,
      restoreComment,
      getReport,
      getReportsForComment,
      updateReportStatus,
      resolveRelatedReports,
      dismissReport,
      getContactMessage,
      markContactRead,
      updateContactStatus,
      updateContactInternalNote,
      toggleGlobalAds,
      updateAdPlacement,
      resetToFixtures,
    ],
  );

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
}

export function useAdminData(): AdminContextType {
  const ctx = useContext(AdminContext);
  if (ctx === null) {
    throw new Error("useAdminData must be used within an AdminDataProvider");
  }
  return ctx;
}
