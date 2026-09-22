"use client";

import { useCallback, type Dispatch, type SetStateAction } from "react";
import type {
  AdminContactMessage,
  AdminContactStatus,
} from "../types/admin.types";

interface AdminContactActionState {
  contactMessages: AdminContactMessage[];
  setContactMessages: Dispatch<SetStateAction<AdminContactMessage[]>>;
}

export function useAdminContactActions({
  contactMessages,
  setContactMessages,
}: AdminContactActionState) {
  const getContactMessage = useCallback(
    (messageId: string): AdminContactMessage | undefined =>
      contactMessages.find(
        (m) => m.id.toLowerCase() === messageId.toLowerCase(),
      ),
    [contactMessages],
  );

  const markContactRead = useCallback(
    (messageId: string): void => {
      setContactMessages((prev) =>
        prev.map((m) =>
          m.id.toLowerCase() === messageId.toLowerCase()
            ? {
                ...m,
                isRead: true,
                status: m.status === "unread" ? "open" : m.status,
              }
            : m,
        ),
      );
    },
    [setContactMessages],
  );

  const updateContactStatus = useCallback(
    (messageId: string, status: AdminContactStatus): void => {
      setContactMessages((prev) =>
        prev.map((m) =>
          m.id.toLowerCase() === messageId.toLowerCase()
            ? {
                ...m,
                status,
                isRead: status === "unread" ? false : true,
              }
            : m,
        ),
      );
    },
    [setContactMessages],
  );

  const updateContactInternalNote = useCallback(
    (messageId: string, note: string): void => {
      setContactMessages((prev) =>
        prev.map((m) =>
          m.id.toLowerCase() === messageId.toLowerCase()
            ? { ...m, internalNote: note }
            : m,
        ),
      );
    },
    [setContactMessages],
  );

  return {
    getContactMessage,
    markContactRead,
    updateContactStatus,
    updateContactInternalNote,
  };
}
