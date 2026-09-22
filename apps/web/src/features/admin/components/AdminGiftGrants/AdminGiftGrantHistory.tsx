"use client";

import Link from "next/link";
import type { Route } from "next";
import { Gift, History } from "lucide-react";
import { useAdminPagination } from "../../hooks/use-admin-pagination";
import {
  ADMIN_GIFT_TYPE_LABELS,
  type AdminGiftGrantRecord,
} from "../../types/admin.types";
import { AdminPagination } from "../AdminPagination/AdminPagination";
import styles from "./AdminGiftGrants.module.css";

const GRANTS_PER_PAGE = 6;

type Props = Readonly<{ grantRecords: readonly AdminGiftGrantRecord[] }>;

export function AdminGiftGrantHistory({ grantRecords }: Props) {
  const {
    currentPage,
    totalPages,
    pageItems: paginatedRecords,
    setCurrentPage,
  } = useAdminPagination(grantRecords, GRANTS_PER_PAGE);

  return (
    <div className={styles["historyCard"]}>
      <div className={styles["historyHeader"]}>
        <h3 className={styles["historyTitle"]}>
          <History
            style={{
              width: "1.25rem",
              height: "1.25rem",
              color: "var(--primary)",
            }}
          />
          سجل منح الهدايا التقديرية
        </h3>
        <span style={{ fontSize: "0.8125rem", color: "rgba(255,255,255,0.5)" }}>
          إجمالي السجلات: {String(grantRecords.length)}
        </span>
      </div>

      <div className={styles["tableWrapper"]}>
        <table className={styles["table"]}>
          <thead className={styles["thead"]}>
            <tr>
              <th className={styles["th"]}>معرّف المنح</th>
              <th className={styles["th"]}>الهدية الممنوحة</th>
              <th className={styles["th"]}>المستلم</th>
              <th className={styles["th"]}>المانح</th>
              <th className={styles["th"]}>تاريخ المنح</th>
              <th className={styles["th"]}>السبب</th>
              <th className={styles["th"]}>الإشعار المرسل</th>
            </tr>
          </thead>
          <tbody>
            {paginatedRecords.map((record) => (
              <tr key={record.id} className={styles["tr"]}>
                <td className={styles["td"]}>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: "rgba(255,255,255,0.4)",
                    }}
                  >
                    {record.id}
                  </span>
                </td>
                <td className={styles["td"]}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                    }}
                  >
                    <Gift
                      style={{
                        width: "0.875rem",
                        height: "0.875rem",
                        color: "var(--primary)",
                      }}
                    />
                    <span style={{ fontWeight: 700, color: "#ffffff" }}>
                      {record.giftName}
                    </span>
                    <span
                      style={{
                        fontSize: "0.7rem",
                        color: "rgba(255,255,255,0.4)",
                      }}
                    >
                      ({ADMIN_GIFT_TYPE_LABELS[record.giftType]})
                    </span>
                  </div>
                </td>
                <td className={styles["td"]}>
                  <Link
                    href={`/admin/users/${record.userId}` as Route}
                    style={{
                      color: "#ffffff",
                      fontWeight: 700,
                      textDecoration: "none",
                    }}
                  >
                    {record.userName}
                  </Link>
                </td>
                <td className={styles["td"]}>
                  <span
                    style={{
                      fontSize: "0.8125rem",
                      color: "rgba(255,255,255,0.6)",
                    }}
                  >
                    {record.grantedBy}
                  </span>
                </td>
                <td className={styles["td"]}>
                  <span
                    style={{
                      fontSize: "0.8125rem",
                      color: "rgba(255,255,255,0.6)",
                    }}
                  >
                    {record.grantedAt}
                  </span>
                </td>
                <td className={styles["td"]}>
                  <span
                    style={{
                      fontSize: "0.8125rem",
                      color: "rgba(255,255,255,0.8)",
                    }}
                  >
                    {record.reason}
                  </span>
                </td>
                <td className={styles["td"]}>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: "rgba(255,255,255,0.5)",
                      maxWidth: "200px",
                      display: "inline-block",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                    title={`${record.notificationTitle} - ${record.notificationBody}`}
                  >
                    {record.notificationTitle}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div style={{ padding: "1rem" }}>
          <AdminPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={grantRecords.length}
            itemsPerPage={GRANTS_PER_PAGE}
            onPageChange={setCurrentPage}
            itemName="سجل منح"
          />
        </div>
      )}
    </div>
  );
}
