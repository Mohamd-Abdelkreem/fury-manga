"use client";

import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  INITIAL_ADMIN_ACTIVITY,
  INITIAL_ADMIN_AD_PLACEMENTS,
  INITIAL_ADMIN_COMMENTS,
  INITIAL_ADMIN_CONTACT_MESSAGES,
  INITIAL_ADMIN_GIFTS,
  INITIAL_ADMIN_GIFT_GRANTS,
  INITIAL_ADMIN_GLOBAL_ADS,
  INITIAL_ADMIN_REPORTS,
  INITIAL_ADMIN_USER,
  INITIAL_ADMIN_USERS,
  INITIAL_ADMIN_USER_DETAILS,
} from "../data/adminFixtures";
import type {
  AdminActivityEvent,
  AdminAdPlacement,
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
} from "../types/admin.types";
import { useAdminUserActions } from "../hooks/use-admin-user-actions";
import { useAdminGiftActions } from "../hooks/use-admin-gift-actions";
import { useAdminModerationActions } from "../hooks/use-admin-moderation-actions";
import { useAdminContactActions } from "../hooks/use-admin-contact-actions";
import { useAdminAdActions } from "../hooks/use-admin-ad-actions";
import { deriveAdminMetrics } from "../model/admin-metrics";

interface AdminContextType {
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
}

const AdminContext = createContext<AdminContextType | null>(null);

export function AdminDataProvider({ children }: { children: ReactNode }) {
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
    () => deriveAdminMetrics({ users, reports, contactMessages }),
    [users, reports, contactMessages],
  );

  const user = INITIAL_ADMIN_USER;

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

  const value = useMemo(
    () => ({
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
    }),
    [
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
