"use client";

import { useCallback, type Dispatch, type SetStateAction } from "react";
import type {
  AdminActivityEvent,
  AdminGiftDesign,
  AdminGiftGrantRecord,
  AdminUser,
  AdminUserDetail,
} from "../types/admin.types";

interface AdminGiftActionState {
  gifts: AdminGiftDesign[];
  setGifts: Dispatch<SetStateAction<AdminGiftDesign[]>>;
  users: AdminUser[];
  setUsers: Dispatch<SetStateAction<AdminUser[]>>;
  userDetails: Record<string, AdminUserDetail>;
  setUserDetails: Dispatch<SetStateAction<Record<string, AdminUserDetail>>>;
  setGrantRecords: Dispatch<SetStateAction<AdminGiftGrantRecord[]>>;
  setActivities: Dispatch<SetStateAction<AdminActivityEvent[]>>;
  actorName: string;
}

export function useAdminGiftActions({
  gifts,
  setGifts,
  users,
  setUsers,
  userDetails,
  setUserDetails,
  setGrantRecords,
  setActivities,
  actorName,
}: AdminGiftActionState) {
  const getGift = useCallback(
    (giftId: string): AdminGiftDesign | undefined => {
      return gifts.find((g) => g.id === giftId);
    },
    [gifts],
  );

  const createGift = useCallback(
    (
      giftData: Omit<AdminGiftDesign, "id" | "createdAt" | "recipientCount">,
    ): AdminGiftDesign => {
      const today = new Date().toISOString().slice(0, 10);
      const slug =
        giftData.name
          .trim()
          .toLowerCase()
          .replace(/[^\u0621-\u064A\w\s-]/gu, "")
          .replace(/\s+/g, "-") || `gift-${String(Date.now())}`;
      const giftId = `${slug}-${String(Math.floor(Math.random() * 1000))}`;

      const newGift: AdminGiftDesign = {
        ...giftData,
        id: giftId,
        createdAt: today,
        recipientCount: 0,
      };

      setGifts((prev) => [newGift, ...prev]);

      setActivities((prev) => [
        {
          id: `act-${String(Date.now())}`,
          type: "work_created",
          title: "تصميم هدية جديدة",
          description: `تمت إضافة تصميم الهدية '${newGift.name}'.`,
          timestamp: "الآن",
          actor: actorName,
        },
        ...prev,
      ]);

      return newGift;
    },
    [actorName, setActivities, setGifts],
  );

  const updateGift = useCallback(
    (
      giftId: string,
      updates: Partial<AdminGiftDesign>,
    ): AdminGiftDesign | undefined => {
      const current = gifts.find((gift) => gift.id === giftId);
      if (current === undefined) return undefined;

      const updated: AdminGiftDesign = { ...current, ...updates };
      setGifts((previous) =>
        previous.map((gift) =>
          gift.id === giftId ? { ...gift, ...updates } : gift,
        ),
      );

      setActivities((prev) => [
        {
          id: `act-${String(Date.now())}`,
          type: "work_updated",
          title: "تحديث تصميم هدية",
          description: `تم تحديث بيانات الهدية '${updated.name}'.`,
          timestamp: "الآن",
          actor: actorName,
        },
        ...prev,
      ]);

      return updated;
    },
    [gifts, actorName, setActivities, setGifts],
  );

  const toggleGiftStatus = useCallback(
    (giftId: string): void => {
      setGifts((prev) =>
        prev.map((g) => {
          if (g.id === giftId) {
            const nextStatus = g.status === "active" ? "disabled" : "active";
            return { ...g, status: nextStatus };
          }
          return g;
        }),
      );
    },
    [setGifts],
  );

  const grantGiftToUser = useCallback(
    (params: {
      giftId: string;
      userId: string;
      reason: string;
      notificationTitle: string;
      notificationBody: string;
    }): AdminGiftGrantRecord => {
      const today = new Date().toISOString().slice(0, 10);
      const targetGift = gifts.find((g) => g.id === params.giftId);
      const targetUser = users.find((u) => u.id === params.userId);

      if (targetGift === undefined || targetUser === undefined) {
        throw new Error("الهدية أو المستخدم غير موجود");
      }

      const grantId = `grant-${String(Date.now())}`;
      const record: AdminGiftGrantRecord = {
        id: grantId,
        giftId: targetGift.id,
        giftName: targetGift.name,
        giftType: targetGift.type,
        userId: targetUser.id,
        userName: targetUser.name,
        userEmail: targetUser.email,
        grantedBy: actorName,
        grantedAt: today,
        reason: params.reason,
        notificationTitle: params.notificationTitle,
        notificationBody: params.notificationBody,
      };

      setGrantRecords((prev) => [record, ...prev]);

      setGifts((prev) =>
        prev.map((g) =>
          g.id === targetGift.id
            ? { ...g, recipientCount: g.recipientCount + 1 }
            : g,
        ),
      );

      setUsers((prev) =>
        prev.map((u) =>
          u.id === targetUser.id ? { ...u, giftsCount: u.giftsCount + 1 } : u,
        ),
      );

      setUserDetails((prev) => {
        const detail = prev[targetUser.id];
        if (detail === undefined) return prev;
        return {
          ...prev,
          [targetUser.id]: {
            ...detail,
            giftsCount: detail.giftsCount + 1,
            ownedGifts: [
              {
                grantId,
                giftId: targetGift.id,
                giftName: targetGift.name,
                giftType: targetGift.type,
                grantedAt: today,
                grantedBy: actorName,
                reason: params.reason,
              },
              ...detail.ownedGifts,
            ],
          },
        };
      });

      setActivities((prev) => [
        {
          id: `act-${String(Date.now())}`,
          type: "chapter_published",
          title: "منح هدية لمستخدم",
          description: `تم منح الهدية '${targetGift.name}' للمستخدم '${targetUser.name}'.`,
          timestamp: "الآن",
          actor: actorName,
        },
        ...prev,
      ]);

      return record;
    },
    [
      gifts,
      actorName,
      users,
      setActivities,
      setGifts,
      setGrantRecords,
      setUserDetails,
      setUsers,
    ],
  );

  const bulkGrantGift = useCallback(
    (params: {
      giftId: string;
      reason: string;
      notificationTitle: string;
      notificationBody: string;
    }): { grantedCount: number; records: AdminGiftGrantRecord[] } => {
      const today = new Date().toISOString().slice(0, 10);
      const targetGift = gifts.find((g) => g.id === params.giftId);

      if (targetGift === undefined) {
        throw new Error("الهدية غير موجودة");
      }

      // Eligible users: active, non-admin, and do not already own this gift
      const eligibleUsers = users.filter((u) => {
        if (u.status !== "active" || u.role === "admin") return false;
        const detail = userDetails[u.id];
        if (detail !== undefined) {
          const alreadyOwns = detail.ownedGifts.some(
            (g) => g.giftId === targetGift.id,
          );
          if (alreadyOwns) return false;
        }
        return true;
      });

      const newRecords: AdminGiftGrantRecord[] = eligibleUsers.map(
        (u, idx) => ({
          id: `grant-${String(Date.now())}-${String(idx)}`,
          giftId: targetGift.id,
          giftName: targetGift.name,
          giftType: targetGift.type,
          userId: u.id,
          userName: u.name,
          userEmail: u.email,
          grantedBy: actorName,
          grantedAt: today,
          reason: params.reason,
          notificationTitle: params.notificationTitle,
          notificationBody: params.notificationBody,
        }),
      );

      const eligibleIds = new Set(eligibleUsers.map((u) => u.id));
      const grantsByUserId = new Map(
        newRecords.map((record) => [record.userId, record]),
      );

      setGrantRecords((prev) => [...newRecords, ...prev]);

      setGifts((prev) =>
        prev.map((g) =>
          g.id === targetGift.id
            ? { ...g, recipientCount: g.recipientCount + eligibleUsers.length }
            : g,
        ),
      );

      setUsers((prev) =>
        prev.map((u) =>
          eligibleIds.has(u.id) ? { ...u, giftsCount: u.giftsCount + 1 } : u,
        ),
      );

      setUserDetails((prev) => {
        const next = { ...prev };
        for (const u of eligibleUsers) {
          const detail = next[u.id];
          const grant = grantsByUserId.get(u.id);
          if (detail !== undefined && grant !== undefined) {
            next[u.id] = {
              ...detail,
              giftsCount: detail.giftsCount + 1,
              ownedGifts: [
                {
                  grantId: grant.id,
                  giftId: targetGift.id,
                  giftName: targetGift.name,
                  giftType: targetGift.type,
                  grantedAt: today,
                  grantedBy: actorName,
                  reason: params.reason,
                },
                ...detail.ownedGifts,
              ],
            };
          }
        }
        return next;
      });

      setActivities((prev) => [
        {
          id: `act-${String(Date.now())}`,
          type: "chapter_published",
          title: "منح جماعي لهدية",
          description: `تم منح الهدية '${targetGift.name}' جماعياً لعدد ${String(eligibleUsers.length)} مستخدم.`,
          timestamp: "الآن",
          actor: actorName,
        },
        ...prev,
      ]);

      return { grantedCount: eligibleUsers.length, records: newRecords };
    },
    [
      gifts,
      actorName,
      userDetails,
      users,
      setActivities,
      setGifts,
      setGrantRecords,
      setUserDetails,
      setUsers,
    ],
  );

  const revokeGiftFromUser = useCallback(
    (userId: string, giftId: string): void => {
      const targetUser = users.find((u) => u.id === userId);
      const targetGift = gifts.find((g) => g.id === giftId);

      setUserDetails((prev) => {
        const detail = prev[userId];
        if (detail === undefined) return prev;
        const filteredGifts = detail.ownedGifts.filter(
          (g) => g.giftId !== giftId,
        );
        return {
          ...prev,
          [userId]: {
            ...detail,
            giftsCount: Math.max(0, detail.giftsCount - 1),
            ownedGifts: filteredGifts,
          },
        };
      });

      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId
            ? { ...u, giftsCount: Math.max(0, u.giftsCount - 1) }
            : u,
        ),
      );

      setGifts((prev) =>
        prev.map((g) =>
          g.id === giftId
            ? { ...g, recipientCount: Math.max(0, g.recipientCount - 1) }
            : g,
        ),
      );

      setActivities((prev) => [
        {
          id: `act-${String(Date.now())}`,
          type: "report_opened",
          title: "سحب هدية من مستخدم",
          description: `تم سحب الهدية '${targetGift?.name ?? giftId}' من المستخدم '${targetUser?.name ?? userId}'.`,
          timestamp: "الآن",
          actor: actorName,
        },
        ...prev,
      ]);
    },
    [
      gifts,
      actorName,
      users,
      setActivities,
      setGifts,
      setUserDetails,
      setUsers,
    ],
  );

  return {
    getGift,
    createGift,
    updateGift,
    toggleGiftStatus,
    grantGiftToUser,
    bulkGrantGift,
    revokeGiftFromUser,
  };
}
