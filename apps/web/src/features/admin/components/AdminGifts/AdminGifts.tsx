"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Route } from "next";
import {
  Award,
  Edit,
  Eye,
  Gift,
  MessageSquare,
  Plus,
  Power,
  Search,
  Users,
} from "lucide-react";
import { useAdminData } from "../../context/admin-context";
import {
  ADMIN_GIFT_STATUS_LABELS,
  ADMIN_GIFT_TYPE_LABELS,
  type AdminGiftDesign,
} from "../../types/admin.types";
import { AdminNoticeBanner } from "../AdminNoticeBanner/AdminNoticeBanner";
import { AdminStatCard } from "../AdminStatCard/AdminStatCard";
import { AdminGiftDialog } from "./AdminGiftDialog";
import { AdminGiftPreviewModal } from "./AdminGiftPreviewModal";
import styles from "./AdminGifts.module.css";

export function AdminGifts() {
  const { gifts, createGift, updateGift, toggleGiftStatus } = useAdminData();

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    gift?: AdminGiftDesign | undefined;
  }>({
    isOpen: false,
    gift: undefined,
  });

  const [previewGift, setPreviewGift] = useState<AdminGiftDesign | null>(null);

  const [notice, setNotice] = useState<{
    type: "success" | "warning" | "info";
    title: string;
    description: string;
  } | null>(null);

  // Metrics
  const totalCount = gifts.length;
  const framesCount = gifts.filter((g) => g.type === "avatar_frame").length;
  const decorationsCount = gifts.filter(
    (g) => g.type === "comment_decoration",
  ).length;
  const totalRecipients = gifts.reduce((acc, g) => acc + g.recipientCount, 0);

  // Filtered gifts
  const filteredGifts = useMemo(() => {
    const q = search.trim().toLowerCase();
    return gifts.filter((g) => {
      if (q) {
        const matchName = g.name.toLowerCase().includes(q);
        const matchDesc = g.description.toLowerCase().includes(q);
        if (!matchName && !matchDesc) return false;
      }
      if (typeFilter !== "all" && g.type !== typeFilter) return false;
      if (statusFilter !== "all" && g.status !== statusFilter) return false;
      return true;
    });
  }, [gifts, search, typeFilter, statusFilter]);

  const handleSaveGift = (
    data: Omit<AdminGiftDesign, "id" | "createdAt" | "recipientCount">,
  ) => {
    if (dialogState.gift) {
      updateGift(dialogState.gift.id, data);
      setNotice({
        type: "success",
        title: "تم تحديث التصميم",
        description: `تم تحديث بيانات تصميم الهدية (${data.name}) بنجاح.`,
      });
    } else {
      createGift(data);
      setNotice({
        type: "success",
        title: "تصميم جديد",
        description: `تمت إضافة تصميم الهدية (${data.name}) وإتاحته للاستخدام.`,
      });
    }
  };

  const handleToggleStatus = (g: AdminGiftDesign) => {
    toggleGiftStatus(g.id);
    const nextStatus = g.status === "active" ? "معطلة" : "نشطة";
    setNotice({
      type: "info",
      title: "تغيير حالة الهدية",
      description: `تم تغيير حالة (${g.name}) لتصبح ${nextStatus}.`,
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

      {/* Metrics Row */}
      <div className={styles["metricsGrid"]}>
        <AdminStatCard
          title="إجمالي التصاميم"
          value={totalCount}
          icon={Gift}
          description="تصاميم الهدايا المسجلة بالنظام"
        />
        <AdminStatCard
          title="إطارات الصور الشخصية"
          value={framesCount}
          icon={Award}
          description="إطارات دائرية مميزة لصور الأعضاء"
        />
        <AdminStatCard
          title="زخارف التعليقات"
          value={decorationsCount}
          icon={MessageSquare}
          description="حواف وهوامش مضيئة لصندوق التعليق"
        />
        <AdminStatCard
          title="إجمالي المستلمين"
          value={totalRecipients}
          icon={Users}
          description="إجمالي مرات منح الهدايا للمستخدمين"
          action={{
            label: "سجل المنح",
            href: "/admin/gifts/grants",
          }}
        />
      </div>

      {/* Controls Bar */}
      <div className={styles["controlsCard"]}>
        <div className={styles["searchField"]}>
          <Search className={styles["searchIcon"]} />
          <input
            type="text"
            className={styles["searchInput"]}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            placeholder="البحث باسم الهدية أو الوصف..."
            aria-label="البحث عن هدية"
          />
        </div>

        <div className={styles["filtersRow"]}>
          <select
            className={styles["filterSelect"]}
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
            }}
            aria-label="تصفية حسب نوع الهدية"
          >
            <option value="all">كل الأنواع</option>
            <option value="avatar_frame">إطارات صور شخصية</option>
            <option value="comment_decoration">زخارف تعليقات</option>
          </select>

          <select
            className={styles["filterSelect"]}
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
            }}
            aria-label="تصفية حسب الحالة"
          >
            <option value="all">كل الحالات</option>
            <option value="active">نشطة</option>
            <option value="disabled">معطلة</option>
            <option value="archived">مؤرشفة</option>
          </select>

          <button
            type="button"
            onClick={() => {
              setDialogState({ isOpen: true, gift: undefined });
            }}
            className={styles["btnPrimary"]}
          >
            <Plus style={{ width: "1rem", height: "1rem" }} />
            إضافة تصميم جديد
          </button>
        </div>
      </div>

      {/* Gifts Grid */}
      {filteredGifts.length === 0 ? (
        <div
          className={styles["controlsCard"]}
          style={{ textAlign: "center", padding: "3rem" }}
        >
          <Gift className={styles["emptyIcon"]} style={{ margin: "0 auto" }} />
          <h3 className={styles["emptyTitle"]}>لا توجد تصاميم مطابقة</h3>
          <p className={styles["emptyText"]}>
            لم نتمكن من العثور على تصاميم هدايا تطابق خيارات البحث والتصفية.
          </p>
        </div>
      ) : (
        <div className={styles["giftsGrid"]}>
          {filteredGifts.map((g) => {
            const isActive = g.status === "active";

            return (
              <div key={g.id} className={styles["giftCard"]}>
                {/* Visual Representation Header */}
                <div className={styles["giftVisualPreview"]}>
                  {g.type === "avatar_frame" ? (
                    <div
                      className={styles["avatarFrameCircle"]}
                      style={{
                        border: `3px solid ${g.accentColor}`,
                        boxShadow: `0 0 20px ${g.ringColor || "rgba(255,71,71,0.25)"}`,
                      }}
                    >
                      <div
                        style={{
                          width: "60px",
                          height: "60px",
                          borderRadius: "9999px",
                          overflow: "hidden",
                          position: "relative",
                        }}
                      >
                        <Image
                          src="/anime/341452.jpg"
                          alt={g.name}
                          fill
                          sizes="60px"
                          style={{ objectFit: "cover" }}
                          unoptimized
                        />
                      </div>
                    </div>
                  ) : (
                    <div
                      className={styles["commentDecorationMock"]}
                      style={{
                        borderRight: `3px solid ${g.accentColor}`,
                        boxShadow: `inset 0 0 8px ${g.accentColor}15`,
                      }}
                    >
                      <span
                        style={{
                          fontWeight: 700,
                          color: "#ffffff",
                          fontSize: "0.75rem",
                        }}
                      >
                        قارئ متميز
                      </span>
                      <span
                        style={{
                          color: "rgba(255,255,255,0.5)",
                          fontSize: "0.7rem",
                        }}
                      >
                        نموذج نص التعليق مع زخرفة {g.name}...
                      </span>
                    </div>
                  )}
                </div>

                {/* Body */}
                <div className={styles["giftCardBody"]}>
                  <div className={styles["giftHeaderRow"]}>
                    <h3 className={styles["giftName"]}>{g.name}</h3>
                    <span
                      style={{
                        fontSize: "0.7rem",
                        padding: "0.15rem 0.5rem",
                        borderRadius: "9999px",
                        background:
                          g.status === "active"
                            ? "rgba(34, 197, 94, 0.15)"
                            : g.status === "disabled"
                              ? "rgba(239, 68, 68, 0.15)"
                              : "rgba(255, 255, 255, 0.06)",
                        color:
                          g.status === "active"
                            ? "#4ade80"
                            : g.status === "disabled"
                              ? "#f87171"
                              : "rgba(255, 255, 255, 0.6)",
                        fontWeight: 700,
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                      }}
                    >
                      {ADMIN_GIFT_STATUS_LABELS[g.status]}
                    </span>
                  </div>

                  <p className={styles["giftDesc"]}>{g.description}</p>

                  <div className={styles["giftMetaList"]}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>النوع:</span>
                      <span style={{ color: "#ffffff", fontWeight: 700 }}>
                        {ADMIN_GIFT_TYPE_LABELS[g.type]}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>المستلمون:</span>
                      <span
                        style={{ color: "var(--primary)", fontWeight: 750 }}
                      >
                        {String(g.recipientCount)} مستخدم
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>تاريخ الإضافة:</span>
                      <span>{g.createdAt}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className={styles["giftCardFooter"]}>
                  <div className={styles["giftActionsGroup"]}>
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewGift(g);
                      }}
                      className={styles["iconBtn"]}
                      title="معاينة حية للمظهر"
                      aria-label={`معاينة ${g.name}`}
                    >
                      <Eye style={{ width: "0.875rem", height: "0.875rem" }} />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setDialogState({ isOpen: true, gift: g });
                      }}
                      className={styles["iconBtn"]}
                      title="تعديل بيانات التصميم"
                      aria-label={`تعديل ${g.name}`}
                    >
                      <Edit style={{ width: "0.875rem", height: "0.875rem" }} />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        handleToggleStatus(g);
                      }}
                      className={styles["iconBtn"]}
                      title={isActive ? "تعطيل التصميم" : "تفعيل التصميم"}
                      aria-label={`تغيير حالة ${g.name}`}
                    >
                      <Power
                        style={{
                          width: "0.875rem",
                          height: "0.875rem",
                          color: isActive ? "#4ade80" : "#ef4444",
                        }}
                      />
                    </button>
                  </div>

                  <Link
                    href={`/admin/gifts/grants?gift=${g.id}` as Route}
                    className={styles["grantBtn"]}
                    title="منح هذه الهدية للمستخدمين"
                  >
                    <Gift style={{ width: "0.75rem", height: "0.75rem" }} />
                    منح للمستخدمين
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Dialog for Create / Edit */}
      <AdminGiftDialog
        isOpen={dialogState.isOpen}
        gift={dialogState.gift}
        onClose={() => {
          setDialogState({ isOpen: false, gift: undefined });
        }}
        onSave={handleSaveGift}
      />

      {/* Live Preview Modal */}
      <AdminGiftPreviewModal
        isOpen={previewGift !== null}
        gift={previewGift ?? undefined}
        onClose={() => {
          setPreviewGift(null);
        }}
      />
    </div>
  );
}
