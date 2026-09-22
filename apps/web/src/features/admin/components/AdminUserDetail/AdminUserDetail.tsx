"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Route } from "next";
import {
  AlertCircle,
  AlertTriangle,
  Award,
  Ban,
  Bookmark,
  BookOpen,
  Gift,
  RotateCcw,
  Shield,
  Trash2,
} from "lucide-react";
import { useAdminData } from "../../context/admin-context";
import {
  ADMIN_GIFT_TYPE_LABELS,
  ADMIN_USER_ROLE_LABELS,
  ADMIN_USER_STATUS_LABELS,
} from "../../types/admin.types";
import { AdminConfirmDialog } from "../AdminConfirmDialog/AdminConfirmDialog";
import { AdminNoticeBanner } from "../AdminNoticeBanner/AdminNoticeBanner";
import styles from "./AdminUserDetail.module.css";

interface AdminUserDetailProps {
  userId: string;
}

export function AdminUserDetail({ userId }: AdminUserDetailProps) {
  const { getUser, suspendUser, reactivateUser, revokeGiftFromUser } =
    useAdminData();

  const user = getUser(userId);

  const [notice, setNotice] = useState<{
    type: "warning" | "success" | "info";
    title: string;
    description: string;
  } | null>(null);

  const [suspendDialog, setSuspendDialog] = useState<boolean>(false);
  const [revokeDialog, setRevokeDialog] = useState<{
    isOpen: boolean;
    giftId: string;
    giftName: string;
  }>({
    isOpen: false,
    giftId: "",
    giftName: "",
  });

  if (!user) {
    return (
      <div className={styles["container"]}>
        <div className={styles["card"]}>
          <div className={styles["emptyState"]}>
            <AlertCircle
              style={{
                width: "3rem",
                height: "3rem",
                color: "#ef4444",
                margin: "0 auto 1rem",
              }}
            />
            <h2 style={{ color: "#fff", marginBottom: "0.5rem" }}>
              المستخدم غير موجود
            </h2>
            <p
              style={{ color: "rgba(255,255,255,0.5)", marginBottom: "1.5rem" }}
            >
              تعذر العثور على بيانات المستخدم المطلوب في النظام.
            </p>
            <Link href={"/admin/users"} className={styles["btnPrimary"]}>
              العودة لقائمة المستخدمين
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isAdmin = user.role === "admin";
  const isSuspended = user.status === "suspended";

  const handleConfirmSuspend = () => {
    suspendUser(user.id, "إجراء إداري من صفحة تفاصيل المستخدم");
    setNotice({
      type: "warning",
      title: "تم تعليق الحساب",
      description: `تم تعليق حساب المستخدم (${user.name}) بنجاح.`,
    });
    setSuspendDialog(false);
  };

  const handleConfirmReactivate = () => {
    reactivateUser(user.id);
    setNotice({
      type: "success",
      title: "استعادة النشاط",
      description: `تم إلغاء تعليق حساب (${user.name}) واستعادة النشاط بنجاح.`,
    });
  };

  const handleConfirmRevoke = () => {
    if (!revokeDialog.giftId) return;
    revokeGiftFromUser(user.id, revokeDialog.giftId);
    setNotice({
      type: "warning",
      title: "تم سحب الهدية",
      description: `تم سحب الهدية (${revokeDialog.giftName}) من المستخدم بنجاح.`,
    });
    setRevokeDialog({ isOpen: false, giftId: "", giftName: "" });
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

      {/* Profile Header Card */}
      <div className={styles["profileCard"]}>
        <div className={styles["profileMain"]}>
          <div className={styles["avatar"]}>
            <Image
              src={user.avatarUrl || "/anime/341452.jpg"}
              alt={user.name}
              fill
              sizes="72px"
              style={{ objectFit: "cover" }}
              unoptimized
            />
          </div>
          <div className={styles["profileInfo"]}>
            <div className={styles["nameRow"]}>
              <h1 className={styles["name"]}>{user.name}</h1>
              <span
                style={{
                  fontSize: "0.75rem",
                  padding: "0.2rem 0.6rem",
                  borderRadius: "9999px",
                  background:
                    user.role === "admin"
                      ? "rgba(239, 68, 68, 0.15)"
                      : user.role === "moderator"
                        ? "rgba(59, 130, 246, 0.15)"
                        : "rgba(255, 255, 255, 0.06)",
                  color:
                    user.role === "admin"
                      ? "#ff6b6b"
                      : user.role === "moderator"
                        ? "#60a5fa"
                        : "rgba(255, 255, 255, 0.8)",
                  fontWeight: 700,
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                }}
              >
                {ADMIN_USER_ROLE_LABELS[user.role]}
              </span>
              <span
                style={{
                  fontSize: "0.75rem",
                  padding: "0.2rem 0.6rem",
                  borderRadius: "9999px",
                  background: isSuspended
                    ? "rgba(239, 68, 68, 0.15)"
                    : "rgba(34, 197, 94, 0.15)",
                  color: isSuspended ? "#f87171" : "#4ade80",
                  fontWeight: 700,
                  border: isSuspended
                    ? "1px solid rgba(239, 68, 68, 0.3)"
                    : "1px solid rgba(34, 197, 94, 0.3)",
                }}
              >
                {ADMIN_USER_STATUS_LABELS[user.status]}
              </span>
            </div>

            <p className={styles["email"]}>{user.email}</p>

            <div className={styles["metaRow"]}>
              <span>معرّف المستخدم: {user.id}</span>
              <span>•</span>
              <span>تاريخ الانضمام: {user.joinedAt}</span>
              <span>•</span>
              <span>آخر ظهور: {user.lastActiveAt}</span>
            </div>
          </div>
        </div>

        <div className={styles["profileActions"]}>
          <Link
            href={`/admin/gifts/grants?user=${user.id}` as Route}
            className={styles["btnPrimary"]}
          >
            <Gift style={{ width: "1rem", height: "1rem" }} />
            منح هدية تقديرية
          </Link>

          {isSuspended ? (
            <button
              type="button"
              onClick={handleConfirmReactivate}
              className={styles["btnSecondary"]}
            >
              <RotateCcw
                style={{ width: "1rem", height: "1rem", color: "#4ade80" }}
              />
              إلغاء تعليق الحساب
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setSuspendDialog(true);
              }}
              disabled={isAdmin}
              className={styles["btnDanger"]}
              title={
                isAdmin ? "لا يمكن تعليق حسابات الإدارة" : "تعليق حساب المستخدم"
              }
            >
              <Ban style={{ width: "1rem", height: "1rem" }} />
              تعليق الحساب
            </button>
          )}
        </div>
      </div>

      {/* Points & Policy Disclaimer Card */}
      <div className={styles["pointsDisclaimerCard"]}>
        <div className={styles["pointsValueArea"]}>
          <span className={styles["pointsNumber"]}>{String(user.points)}</span>
          <span className={styles["pointsLabel"]}>نقاط المشاهدة المكتسبة</span>
        </div>
        <div
          style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}
        >
          <AlertTriangle
            style={{
              width: "1.125rem",
              height: "1.125rem",
              color: "#ffb300",
              flexShrink: 0,
              marginTop: "0.125rem",
            }}
          />
          <p className={styles["pointsText"]}>
            <strong>ملاحظة سياسة النظام:</strong> عداد نقاط المشاهدة يمثل مؤشراً
            تراكمياً لعدد إعلانات المكافأة التي شاهدها المستخدم لدعم المترجمين
            والمنصة، ولا يمثل رصيداً مالياً قابلاً للتعديل اليدوي. كما أن البريد
            الإلكتروني للمستخدم ثابت ولا يمكن تعديله إدارياً حفاظاً على أمان
            وموثوقية الحساب.
          </p>
        </div>
      </div>

      {/* 2x2 Grid for Content Panels */}
      <div className={styles["grid2"]}>
        {/* Panel 1: Reading Progress */}
        <div className={styles["card"]}>
          <div className={styles["cardHeader"]}>
            <h2 className={styles["cardTitle"]}>
              <BookOpen className={styles["cardIcon"]} />
              سجل القراءة والمتابعة
            </h2>
            <span className={styles["countBadge"]}>
              {String(user.readingProgress.length)}
            </span>
          </div>

          {user.readingProgress.length === 0 ? (
            <p className={styles["emptyState"]}>
              لا توجد سجلات قراءة مسجلة لهذا المستخدم حتى الآن.
            </p>
          ) : (
            <div className={styles["readingList"]}>
              {user.readingProgress.map((item) => (
                <div key={item.workId} className={styles["readingItem"]}>
                  <div>
                    <div className={styles["readingItemTitle"]}>
                      {item.workTitle}
                    </div>
                    <div className={styles["readingItemChapter"]}>
                      آخر فصل: الفصل {String(item.lastChapterNumber)} -{" "}
                      {item.lastChapterTitle}
                    </div>
                  </div>
                  <div className={styles["readingItemDate"]}>
                    {item.lastReadAt}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Panel 2: Bookmarks */}
        <div className={styles["card"]}>
          <div className={styles["cardHeader"]}>
            <h2 className={styles["cardTitle"]}>
              <Bookmark className={styles["cardIcon"]} />
              قائمة المحفوظات (المفضلة)
            </h2>
            <span className={styles["countBadge"]}>
              {String(user.bookmarks.length)}
            </span>
          </div>

          {user.bookmarks.length === 0 ? (
            <p className={styles["emptyState"]}>
              لم يقم المستخدم بحفظ أي أعمال في المفضلة بعد.
            </p>
          ) : (
            <div className={styles["bookmarksGrid"]}>
              {user.bookmarks.map((bm) => (
                <div key={bm.workId} className={styles["bookmarkCard"]}>
                  <div className={styles["bookmarkThumb"]}>
                    <Image
                      src={bm.coverImage}
                      alt={bm.workTitle}
                      fill
                      sizes="140px"
                      style={{ objectFit: "cover" }}
                      unoptimized
                    />
                  </div>
                  <h4 className={styles["bookmarkTitle"]} title={bm.workTitle}>
                    {bm.workTitle}
                  </h4>
                  <span
                    style={{
                      fontSize: "0.7rem",
                      color: "rgba(255,255,255,0.45)",
                      padding: "0 0.5rem",
                    }}
                  >
                    {String(bm.totalChapters)} فصول
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Panel 3: Owned Gifts */}
        <div className={styles["card"]}>
          <div className={styles["cardHeader"]}>
            <h2 className={styles["cardTitle"]}>
              <Gift className={styles["cardIcon"]} />
              الهدايا التقديرية المملوكة
            </h2>
            <span className={styles["countBadge"]}>
              {String(user.ownedGifts.length)}
            </span>
          </div>

          {user.ownedGifts.length === 0 ? (
            <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
              <p className={styles["emptyState"]}>
                لا يمتلك هذا المستخدم أي هدايا تقديرية مخصصة.
              </p>
              <Link
                href={`/admin/gifts/grants?user=${user.id}` as Route}
                className={styles["btnSecondary"]}
                style={{ marginTop: "0.5rem", display: "inline-flex" }}
              >
                <Gift style={{ width: "0.875rem", height: "0.875rem" }} />
                منح هدية لهذا الحساب
              </Link>
            </div>
          ) : (
            <div className={styles["giftsList"]}>
              {user.ownedGifts.map((gift) => (
                <div key={gift.grantId} className={styles["giftItem"]}>
                  <div className={styles["giftInfo"]}>
                    <span className={styles["giftName"]}>
                      <Award
                        style={{
                          width: "1rem",
                          height: "1rem",
                          color: "var(--primary)",
                        }}
                      />
                      {gift.giftName}
                      <span
                        style={{
                          fontSize: "0.7rem",
                          color: "rgba(255,255,255,0.5)",
                          fontWeight: 400,
                        }}
                      >
                        ({ADMIN_GIFT_TYPE_LABELS[gift.giftType]})
                      </span>
                    </span>
                    <span className={styles["giftReason"]}>
                      السبب: {gift.reason}
                    </span>
                    <span className={styles["giftMeta"]}>
                      مُنحت بواسطة {gift.grantedBy} بتاريخ {gift.grantedAt}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setRevokeDialog({
                        isOpen: true,
                        giftId: gift.giftId,
                        giftName: gift.giftName,
                      });
                    }}
                    className={styles["revokeBtn"]}
                    aria-label={`سحب هدية ${gift.giftName}`}
                  >
                    <Trash2
                      style={{
                        width: "0.75rem",
                        height: "0.75rem",
                        display: "inline-block",
                        verticalAlign: "middle",
                        marginLeft: "0.25rem",
                      }}
                    />
                    سحب الهدية
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Panel 4: Moderation Notes */}
        <div className={styles["card"]}>
          <div className={styles["cardHeader"]}>
            <h2 className={styles["cardTitle"]}>
              <Shield className={styles["cardIcon"]} />
              سجل الإشراف والملاحظات الإدارية
            </h2>
            <span className={styles["countBadge"]}>
              {String(user.moderationNotes.length)}
            </span>
          </div>

          {user.moderationNotes.length === 0 ? (
            <p className={styles["emptyState"]}>
              السجل نظيف. لا توجد ملاحظات إشرافية أو بلاغات سابقة ضد هذا الحساب.
            </p>
          ) : (
            <div className={styles["notesTimeline"]}>
              {user.moderationNotes.map((note) => (
                <div key={note.id} className={styles["noteCard"]}>
                  <div className={styles["noteHeader"]}>
                    <span>المسؤول: {note.author}</span>
                    <span>{note.createdAt}</span>
                  </div>
                  <p className={styles["noteContent"]}>{note.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Suspend Confirm Dialog */}
      <AdminConfirmDialog
        isOpen={suspendDialog}
        title="تأكيد تعليق حساب المستخدم"
        description={`هل أنت متأكد من رغبتك في تعليق حساب (${user.name})؟ سيتم منع المستخدم من التفاعل أو إضافة تعليقات جديدة.`}
        confirmLabel="تأكيد التعليق"
        cancelLabel="إلغاء"
        onConfirm={handleConfirmSuspend}
        onCancel={() => {
          setSuspendDialog(false);
        }}
      />

      {/* Revoke Gift Confirm Dialog */}
      <AdminConfirmDialog
        isOpen={revokeDialog.isOpen}
        title="تأكيد سحب الهدية"
        description={`هل أنت متأكد من رغبتك في سحب هدية (${revokeDialog.giftName}) من المستخدم (${user.name})؟ لن يعود بإمكان المستخدم تفعيل هذا الإطار أو الزخرفة.`}
        confirmLabel="تأكيد السحب"
        cancelLabel="إلغاء"
        onConfirm={handleConfirmRevoke}
        onCancel={() => {
          setRevokeDialog({ isOpen: false, giftId: "", giftName: "" });
        }}
      />
    </div>
  );
}
