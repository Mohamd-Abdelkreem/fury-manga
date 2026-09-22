"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Route } from "next";
import {
  Ban,
  CheckCircle2,
  Eye,
  Gift,
  RotateCcw,
  Search,
  UserCheck,
  Users,
  UserX,
} from "lucide-react";
import { useAdminData } from "../../context/admin-context";
import { useAdminPagination } from "../../hooks/use-admin-pagination";
import {
  ADMIN_USER_ROLE_LABELS,
  ADMIN_USER_STATUS_LABELS,
  type AdminUser,
} from "../../types/admin.types";
import { AdminConfirmDialog } from "../AdminConfirmDialog/AdminConfirmDialog";
import { AdminNoticeBanner } from "../AdminNoticeBanner/AdminNoticeBanner";
import { cn } from "@/lib/utils";
import { AdminPagination } from "../AdminPagination/AdminPagination";
import { AdminStatCard } from "../AdminStatCard/AdminStatCard";
import styles from "./AdminUsers.module.css";

const USERS_PER_PAGE = 8;

export function AdminUsers() {
  const { users, suspendUser, reactivateUser } = useAdminData();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [giftFilter, setGiftFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  const [notice, setNotice] = useState<{
    type: "warning" | "success" | "info";
    title: string;
    description: string;
  } | null>(null);

  // Suspend dialog state
  const [suspendDialog, setSuspendDialog] = useState<{
    isOpen: boolean;
    user: AdminUser | null;
    reason: string;
  }>({
    isOpen: false,
    user: null,
    reason: "",
  });

  // Calculate metrics
  const totalCount = users.length;
  const activeCount = users.filter((u) => u.status === "active").length;
  const suspendedCount = users.filter((u) => u.status === "suspended").length;
  const giftHoldersCount = users.filter((u) => u.giftsCount > 0).length;

  // Filter users
  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    return users.filter((u) => {
      if (q) {
        const matchName = u.name.toLowerCase().includes(q);
        const matchEmail = u.email.toLowerCase().includes(q);
        if (!matchName && !matchEmail) return false;
      }
      if (statusFilter !== "all" && u.status !== statusFilter) return false;
      if (roleFilter !== "all" && u.role !== roleFilter) return false;
      if (giftFilter === "has_gifts" && u.giftsCount === 0) return false;
      if (giftFilter === "no_gifts" && u.giftsCount > 0) return false;
      return true;
    });
  }, [users, search, statusFilter, roleFilter, giftFilter]);

  const {
    currentPage,
    totalPages,
    pageItems: paginatedUsers,
    setCurrentPage,
  } = useAdminPagination(filteredUsers, USERS_PER_PAGE);

  const handleOpenSuspend = (u: AdminUser) => {
    if (u.role === "admin") return;
    setSuspendDialog({
      isOpen: true,
      user: u,
      reason: "مخالفة معايير المجتمع وقواعد النشر",
    });
  };

  const handleConfirmSuspend = () => {
    if (!suspendDialog.user) return;
    suspendUser(suspendDialog.user.id, suspendDialog.reason || "مخالفة الشروط");
    setNotice({
      type: "warning",
      title: "تم تعليق الحساب",
      description: `تم تعليق حساب المستخدم (${suspendDialog.user.name}) بنجاح.`,
    });
    setSuspendDialog({ isOpen: false, user: null, reason: "" });
  };

  const handleReactivate = (u: AdminUser) => {
    reactivateUser(u.id);
    setNotice({
      type: "success",
      title: "استعادة النشاط",
      description: `تمت استعادة نشاط حساب المستخدم (${u.name}).`,
    });
  };

  return (
    <div className={styles["container"]}>
      {notice && (
        <AdminNoticeBanner
          title={notice.title}
          description={notice.description}
          variant={notice.type}
          onDismiss={() => {
            setNotice(null);
          }}
        />
      )}

      {/* Metrics Cards */}
      <div className={styles["metricsGrid"]}>
        <AdminStatCard
          title="إجمالي المستخدمين"
          value={totalCount}
          icon={Users}
          description="حسابات المسجلين في المنصة"
        />
        <AdminStatCard
          title="المستخدمين النشطين"
          value={activeCount}
          icon={UserCheck}
          description="حسابات مفعلة دون قيود"
        />
        <AdminStatCard
          title="الحسابات الموقوفة"
          value={suspendedCount}
          icon={UserX}
          description="حسابات مقيدة بسبب بلاغات أو مخالفات"
        />
        <AdminStatCard
          title="مستلمو الهدايا"
          value={giftHoldersCount}
          icon={Gift}
          description="مستخدمون يمتلكون إطارات أو زخارف"
          action={{
            label: "إدارة الهدايا",
            href: "/admin/gifts",
          }}
        />
      </div>

      {/* Controls & Filters */}
      <div className={styles["controlsCard"]}>
        <div className={styles["searchField"]}>
          <Search className={styles["searchIcon"]} />
          <input
            type="text"
            className={styles["searchInput"]}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="البحث باسم المستخدم أو البريد الإلكتروني..."
            aria-label="البحث عن مستخدم"
          />
        </div>

        <div className={styles["filtersRow"]}>
          <select
            className={styles["filterSelect"]}
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            aria-label="تصفية حسب الحالة"
          >
            <option value="all">كل الحالات</option>
            <option value="active">نشط</option>
            <option value="suspended">موقوف</option>
          </select>

          <select
            className={styles["filterSelect"]}
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setCurrentPage(1);
            }}
            aria-label="تصفية حسب الدور"
          >
            <option value="all">كل الأدوار</option>
            <option value="user">مستخدم عادي</option>
            <option value="admin">مدير</option>
          </select>

          <select
            className={styles["filterSelect"]}
            value={giftFilter}
            onChange={(e) => {
              setGiftFilter(e.target.value);
              setCurrentPage(1);
            }}
            aria-label="تصفية حسب الهدايا"
          >
            <option value="all">كل الهدايا</option>
            <option value="has_gifts">يمتلك هدايا تقديرية</option>
            <option value="no_gifts">لا يمتلك هدايا</option>
          </select>

          <Link
            href={"/admin/gifts/grants"}
            className={styles["filterSelect"]}
            style={{
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              background: "rgba(255, 71, 71, 0.12)",
              color: "var(--primary)",
              borderColor: "rgba(255, 71, 71, 0.25)",
              fontWeight: 700,
            }}
          >
            <Gift style={{ width: "0.875rem", height: "0.875rem" }} />
            منح هدية جديدة
          </Link>
        </div>
      </div>

      {/* Users Table */}
      <div className={styles["tableCard"]}>
        {paginatedUsers.length === 0 ? (
          <div className={styles["emptyState"]}>
            <Users className={styles["emptyIcon"]} />
            <h3 className={styles["emptyTitle"]}>لا يوجد مستخدمون مطابقون</h3>
            <p className={styles["emptyText"]}>
              لم نتمكن من العثور على أي مستخدم يطابق معايير البحث والتصفية
              المحددة.
            </p>
          </div>
        ) : (
          <div className={styles["tableWrapper"]}>
            <table className={styles["table"]}>
              <thead className={styles["thead"]}>
                <tr>
                  <th className={styles["th"]}>المستخدم</th>
                  <th className={styles["th"]}>الدور</th>
                  <th className={styles["th"]}>الحالة</th>
                  <th className={styles["th"]}>الهدايا</th>
                  <th className={styles["th"]}>تاريخ الانضمام</th>
                  <th className={styles["th"]}>آخر نشاط</th>
                  <th className={styles["th"]}>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((u) => {
                  const isAdmin = u.role === "admin";
                  const isSuspended = u.status === "suspended";

                  return (
                    <tr key={u.id} className={styles["tr"]}>
                      <td className={styles["td"]}>
                        <div className={styles["userCell"]}>
                          <div className={styles["avatar"]}>
                            <Image
                              src={u.avatarUrl || "/anime/341452.jpg"}
                              alt={u.name}
                              fill
                              sizes="40px"
                              style={{ objectFit: "cover" }}
                              unoptimized
                            />
                          </div>
                          <div className={styles["userNameCol"]}>
                            <Link
                              href={`/admin/users/${u.id}` as Route}
                              className={styles["userName"]}
                            >
                              {u.name}
                            </Link>
                            <span className={styles["userEmail"]}>
                              {u.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className={styles["td"]}>
                        <span
                          className={cn(
                            styles["roleBadge"],
                            u.role === "admin" && styles["roleAdmin"],
                            u.role === "user" && styles["roleUser"],
                          )}
                        >
                          {ADMIN_USER_ROLE_LABELS[u.role]}
                        </span>
                      </td>

                      <td className={styles["td"]}>
                        <span
                          className={cn(
                            styles["statusBadge"],
                            isSuspended
                              ? styles["statusSuspended"]
                              : styles["statusActive"],
                          )}
                        >
                          {isSuspended ? (
                            <Ban
                              style={{ width: "0.75rem", height: "0.75rem" }}
                            />
                          ) : (
                            <CheckCircle2
                              style={{ width: "0.75rem", height: "0.75rem" }}
                            />
                          )}
                          {ADMIN_USER_STATUS_LABELS[u.status]}
                        </span>
                      </td>

                      <td className={styles["td"]}>
                        {u.giftsCount > 0 ? (
                          <Link
                            href={`/admin/users/${u.id}` as Route}
                            className={styles["giftsBadge"]}
                            title="عرض الهدايا في صفحة المستخدم"
                          >
                            <Gift
                              style={{ width: "0.75rem", height: "0.75rem" }}
                            />
                            {String(u.giftsCount)}{" "}
                            {u.giftsCount === 1 ? "هدية" : "هدايا"}
                          </Link>
                        ) : (
                          <span
                            style={{
                              fontSize: "0.8125rem",
                              color: "rgba(255,255,255,0.3)",
                            }}
                          >
                            -
                          </span>
                        )}
                      </td>

                      <td className={styles["td"]}>
                        <span
                          style={{
                            fontSize: "0.8125rem",
                            color: "rgba(255,255,255,0.6)",
                          }}
                        >
                          {u.joinedAt}
                        </span>
                      </td>

                      <td className={styles["td"]}>
                        <span
                          style={{
                            fontSize: "0.8125rem",
                            color: "rgba(255,255,255,0.6)",
                          }}
                        >
                          {u.lastActiveAt}
                        </span>
                      </td>

                      <td className={styles["td"]}>
                        <div className={styles["actionsGroup"]}>
                          <Link
                            href={`/admin/users/${u.id}` as Route}
                            className={styles["actionBtn"]}
                            title="عرض التفاصيل وسجل القراءة"
                            aria-label={`عرض تفاصيل ${u.name}`}
                          >
                            <Eye
                              style={{ width: "0.875rem", height: "0.875rem" }}
                            />
                          </Link>

                          <Link
                            href={`/admin/gifts/grants?user=${u.id}` as Route}
                            className={styles["actionBtn"]}
                            title="منح هدية تقديرية لهذا المستخدم"
                            aria-label={`منح هدية لـ ${u.name}`}
                          >
                            <Gift
                              style={{
                                width: "0.875rem",
                                height: "0.875rem",
                                color: "var(--primary)",
                              }}
                            />
                          </Link>

                          {isSuspended ? (
                            <button
                              type="button"
                              onClick={() => {
                                handleReactivate(u);
                              }}
                              className={styles["actionBtn"]}
                              title="إلغاء تعليق الحساب"
                              aria-label={`إلغاء تعليق ${u.name}`}
                            >
                              <RotateCcw
                                style={{
                                  width: "0.875rem",
                                  height: "0.875rem",
                                  color: "#4ade80",
                                }}
                              />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                handleOpenSuspend(u);
                              }}
                              disabled={isAdmin}
                              className={cn(
                                styles["actionBtn"],
                                styles["actionBtnDanger"],
                              )}
                              title={
                                isAdmin
                                  ? "لا يمكن تعليق حسابات الإدارة"
                                  : "تعليق حساب المستخدم"
                              }
                              aria-label={`تعليق حساب ${u.name}`}
                            >
                              <Ban
                                style={{
                                  width: "0.875rem",
                                  height: "0.875rem",
                                }}
                              />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div style={{ padding: "1rem" }}>
            <AdminPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredUsers.length}
              itemsPerPage={USERS_PER_PAGE}
              onPageChange={setCurrentPage}
              itemName="مستخدم"
            />
          </div>
        )}
      </div>

      {/* Suspend Confirmation Dialog */}
      <AdminConfirmDialog
        isOpen={suspendDialog.isOpen}
        title="تأكيد تعليق حساب المستخدم"
        description={`هل أنت متأكد من رغبتك في تعليق حساب (${suspendDialog.user?.name ?? ""})؟ سيتم حرمان المستخدم من نشر التعليقات أو الوصول للامتيازات الخاصة.`}
        confirmLabel="تأكيد التعليق"
        cancelLabel="إلغاء"
        onConfirm={handleConfirmSuspend}
        onCancel={() => {
          setSuspendDialog({ isOpen: false, user: null, reason: "" });
        }}
      />
    </div>
  );
}
