"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  ExternalLink,
  Mail,
  MessageSquare,
  Tag,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdminData } from "../../context/admin-context";
import type { AdminContactStatus } from "../../types/admin.types";
import { ADMIN_CONTACT_SENDER_LABELS } from "../../types/admin.types";
import { AdminPageHeader } from "../AdminPageHeader/AdminPageHeader";
import styles from "./AdminContactDetail.module.css";

const CATEGORY_LABELS: Record<string, string> = {
  translation_team: "طلب انضمام لفريق الترجمة",
  inquiry: "استفسار عام",
  complaint: "شكوى أو بلاغ",
  partnership: "شراكة أو إعلان",
  other: "أخرى",
};

interface AdminContactDetailProps {
  messageId: string;
}

export function AdminContactDetail({ messageId }: AdminContactDetailProps) {
  const {
    contactMessages,
    getContactMessage,
    markContactRead,
    updateContactStatus,
    updateContactInternalNote,
  } = useAdminData();

  const message = getContactMessage(messageId);

  // Auto mark as read upon view
  useEffect(() => {
    if (message && message.status === "unread") {
      markContactRead(message.id);
    }
  }, [message, markContactRead]);

  // Internal notes state
  const [internalNote, setInternalNote] = useState(message?.internalNote ?? "");
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [prevMessageId, setPrevMessageId] = useState(messageId);

  if (prevMessageId !== messageId) {
    setPrevMessageId(messageId);
    setInternalNote(message?.internalNote ?? "");
  }

  if (!message) {
    return (
      <div className={styles["container"]}>
        <div className={styles["notFoundCard"]}>
          <AlertCircle size={48} color="var(--primary)" />
          <h2 style={{ fontSize: "1.25rem", color: "#ffffff", margin: 0 }}>
            الرسالة غير موجودة
          </h2>
          <p
            style={{
              fontSize: "0.875rem",
              color: "rgba(255, 255, 255, 0.6)",
              margin: 0,
            }}
          >
            لم نتمكن من العثور على الرسالة المطلوبة، ربما تم حذفها أو أن الرابط
            غير صحيح.
          </p>
          <Link
            href="/admin/contact"
            className={styles["backBtn"]}
            style={{ marginTop: "1rem" }}
          >
            <ArrowRight size={16} />
            <span>العودة لصندوق الرسائل</span>
          </Link>
        </div>
      </div>
    );
  }

  // Previous and Next messages
  const currentIndex = contactMessages.findIndex(
    (m) => m.id.toLowerCase() === messageId.toLowerCase(),
  );
  const prevMessage =
    currentIndex > 0 ? contactMessages[currentIndex - 1] : null;
  const nextMessage =
    currentIndex < contactMessages.length - 1
      ? contactMessages[currentIndex + 1]
      : null;

  const handleStatusChange = (newStatus: AdminContactStatus) => {
    updateContactStatus(message.id, newStatus);
  };

  const handleSaveNote = () => {
    updateContactInternalNote(message.id, internalNote);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 2500);
  };

  const replyMailto = `mailto:${message.email}?subject=${encodeURIComponent(
    "رد منصة Fury: " + message.subject,
  )}&body=${encodeURIComponent(
    `مرحباً ${message.name}،\n\nشكراً لتواصلك مع إدارة منصة Fury بخصوص: "${message.subject}".\n\n`,
  )}`;

  return (
    <div className={styles["container"]}>
      {/* Top Navigation Row */}
      <div className={styles["navRow"]}>
        <Link href="/admin/contact" className={styles["backBtn"]}>
          <ArrowRight size={16} />
          <span>العودة إلى صندوق الرسائل</span>
        </Link>

        <div className={styles["flipNav"]}>
          {prevMessage ? (
            <Link
              href={`/admin/contact/${prevMessage.id}` as Route}
              className={styles["flipBtn"]}
              title={`الرسالة السابقة: ${prevMessage.subject}`}
            >
              <ChevronRight size={16} />
              <span>السابقة</span>
            </Link>
          ) : (
            <span className={cn(styles["flipBtn"], styles["flipBtnDisabled"])}>
              <ChevronRight size={16} />
              <span>السابقة</span>
            </span>
          )}

          {nextMessage ? (
            <Link
              href={`/admin/contact/${nextMessage.id}` as Route}
              className={styles["flipBtn"]}
              title={`الرسالة التالية: ${nextMessage.subject}`}
            >
              <span>التالية</span>
              <ChevronLeft size={16} />
            </Link>
          ) : (
            <span className={cn(styles["flipBtn"], styles["flipBtnDisabled"])}>
              <span>التالية</span>
              <ChevronLeft size={16} />
            </span>
          )}
        </div>
      </div>

      <AdminPageHeader
        breadcrumbs={[
          { label: "لوحة الإدارة", href: "/admin/dashboard" },
          { label: "رسائل التواصل", href: "/admin/contact" },
          { label: `رسالة #${message.id}` },
        ]}
        title="تفاصيل رسالة التواصل"
        description="استعراض المحتوى الكامل، تحديث حالة الرسالة، وكتابة الملاحظات الإدارية الداخلية."
      />

      {/* Main Grid */}
      <div className={styles["contentGrid"]}>
        {/* Main Column */}
        <div className={styles["mainColumn"]}>
          {/* Sender & Metadata Card */}
          <div className={styles["card"]}>
            <div className={styles["senderHeader"]}>
              <div className={styles["avatar"]}>{message.name.charAt(0)}</div>
              <div className={styles["senderMeta"]}>
                <div className={styles["senderName"]}>{message.name}</div>
                <div className={styles["senderEmailRow"]}>
                  <span>البريد الإلكتروني:</span>
                  <a
                    href={`mailto:${message.email}`}
                    className={styles["senderEmail"]}
                  >
                    {message.email}
                  </a>
                </div>
              </div>
            </div>

            <div className={styles["badgeRow"]}>
              <span
                className={cn(
                  styles["typeBadge"],
                  message.senderType === "registered" &&
                    styles["typeBadgeRegistered"],
                )}
              >
                <User size={12} />
                <span>{ADMIN_CONTACT_SENDER_LABELS[message.senderType]}</span>
              </span>

              <span className={styles["typeBadge"]}>
                <Tag size={12} />
                <span>
                  {CATEGORY_LABELS[message.category ?? "other"] ??
                    message.category ??
                    "أخرى"}
                </span>
              </span>

              <span className={styles["typeBadge"]}>
                <Clock size={12} />
                <span>{message.createdAt}</span>
              </span>
            </div>
          </div>

          {/* Message Content Card */}
          <div className={styles["card"]}>
            <div className={styles["cardHeader"]}>
              <h2 className={styles["subjectTitle"]}>{message.subject}</h2>
            </div>
            <div className={styles["messageBody"]}>{message.message}</div>
          </div>
        </div>

        {/* Sidebar Column */}
        <div className={styles["sidebarColumn"]}>
          {/* Status Control Card */}
          <div className={styles["card"]}>
            <div className={styles["cardTitle"]}>
              <CheckCircle2 size={18} className="text-primary" />
              <span>حالة الرسالة</span>
            </div>

            <div>
              <label className={styles["fieldLabel"]}>الحالة الحالية:</label>
              <select
                className={styles["fieldSelect"]}
                value={message.status}
                onChange={(e) => {
                  handleStatusChange(e.target.value as AdminContactStatus);
                }}
                aria-label="تغيير حالة الرسالة"
              >
                <option value="unread">غير مقروءة (Unread)</option>
                <option value="open">قيد المتابعة (Open)</option>
                <option value="resolved">تمت المعالجة (Resolved)</option>
                <option value="archived">مؤرشفة (Archived)</option>
              </select>
            </div>
          </div>

          {/* Internal Notes Card */}
          <div className={styles["card"]}>
            <div className={styles["cardTitle"]}>
              <MessageSquare size={18} className="text-primary" />
              <span>ملاحظات المشرف الداخلية</span>
            </div>

            <p
              style={{
                fontSize: "0.75rem",
                color: "rgba(255, 255, 255, 0.5)",
                margin: 0,
              }}
            >
              هذه الملاحظات سرية وخاصة بفريق الإدارة، ولا تظهر لمرسل الرسالة.
            </p>

            <textarea
              className={styles["textareaInput"]}
              placeholder="اكتب ملاحظات حول متابعة هذه الرسالة..."
              value={internalNote}
              onChange={(e) => {
                setInternalNote(e.target.value);
              }}
              aria-label="ملاحظات المشرف الداخلية"
            />

            <button
              type="button"
              className={styles["saveNoteBtn"]}
              onClick={handleSaveNote}
            >
              {savedSuccess ? "تم الحفظ بنجاح ✓" : "حفظ الملاحظة"}
            </button>
          </div>

          {/* Reply Action Card */}
          <div className={styles["card"]}>
            <div className={styles["cardTitle"]}>
              <Mail size={18} className="text-primary" />
              <span>الرد على المرسل</span>
            </div>

            <a
              href={replyMailto}
              className={styles["replyBtn"]}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Mail size={16} />
              <span>الرد عبر البريد الإلكتروني</span>
              <ExternalLink size={14} />
            </a>

            <div className={styles["replyDisclaimer"]}>
              سيؤدي النقر إلى فتح برنامج البريد الإلكتروني المفضل لديك مع تعبئة
              عنوان المستلم والموضوع تلقائياً.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
