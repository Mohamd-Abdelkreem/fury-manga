"use client";

import { useCallback, type Dispatch, type SetStateAction } from "react";
import type {
  AdminActivityEvent,
  AdminUser,
  AdminUserDetail,
} from "../types/admin.types";

interface AdminUserActionState {
  setUsers: Dispatch<SetStateAction<AdminUser[]>>;
  userDetails: Record<string, AdminUserDetail>;
  setUserDetails: Dispatch<SetStateAction<Record<string, AdminUserDetail>>>;
  setActivities: Dispatch<SetStateAction<AdminActivityEvent[]>>;
  actorName: string;
}

export function useAdminUserActions({
  setUsers,
  userDetails,
  setUserDetails,
  setActivities,
  actorName,
}: AdminUserActionState) {
  const getUser = useCallback(
    (userId: string): AdminUserDetail | undefined => {
      return userDetails[userId];
    },
    [userDetails],
  );

  const suspendUser = useCallback(
    (userId: string, reason: string): void => {
      const today = new Date().toISOString().slice(0, 10);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, status: "suspended" } : u)),
      );

      setUserDetails((prev) => {
        const target = prev[userId];
        if (target === undefined) return prev;
        return {
          ...prev,
          [userId]: {
            ...target,
            status: "suspended",
            moderationNotes: [
              {
                id: `note-${String(Date.now())}`,
                author: actorName,
                content: `تم تعليق الحساب: ${reason}`,
                createdAt: today,
              },
              ...target.moderationNotes,
            ],
          },
        };
      });

      setActivities((prev) => [
        {
          id: `act-${String(Date.now())}`,
          type: "report_opened",
          title: "تعليق حساب مستخدم",
          description: `تم تعليق حساب المستخدم (${userId}). السبب: ${reason}`,
          timestamp: "الآن",
          actor: actorName,
        },
        ...prev,
      ]);
    },
    [actorName, setActivities, setUserDetails, setUsers],
  );

  const reactivateUser = useCallback(
    (userId: string): void => {
      const today = new Date().toISOString().slice(0, 10);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, status: "active" } : u)),
      );

      setUserDetails((prev) => {
        const target = prev[userId];
        if (target === undefined) return prev;
        return {
          ...prev,
          [userId]: {
            ...target,
            status: "active",
            moderationNotes: [
              {
                id: `note-${String(Date.now())}`,
                author: actorName,
                content: "تم إلغاء تعليق الحساب واستعادة النشاط.",
                createdAt: today,
              },
              ...target.moderationNotes,
            ],
          },
        };
      });

      setActivities((prev) => [
        {
          id: `act-${String(Date.now())}`,
          type: "report_opened",
          title: "إلغاء تعليق مستخدم",
          description: `تمت استعادة نشاط حساب المستخدم (${userId}).`,
          timestamp: "الآن",
          actor: actorName,
        },
        ...prev,
      ]);
    },
    [actorName, setActivities, setUserDetails, setUsers],
  );

  return {
    getUser,
    suspendUser,
    reactivateUser,
  };
}
