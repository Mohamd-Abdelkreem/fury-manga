"use client";

import React, { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AlertTriangle, Bell, Gift, Info, Send, Users } from "lucide-react";
import { useAdminData } from "../../context/admin-context";
import { ADMIN_GIFT_TYPE_LABELS } from "../../types/admin.types";
import { AdminConfirmDialog } from "../AdminConfirmDialog/AdminConfirmDialog";
import { AdminNoticeBanner } from "../AdminNoticeBanner/AdminNoticeBanner";
import { cn } from "@/lib/utils";
import { AdminGiftGrantHistory } from "./AdminGiftGrantHistory";
import styles from "./AdminGiftGrants.module.css";

export function AdminGiftGrants() {
  const searchParams = useSearchParams();
  const initialUserId = searchParams.get("user") || "";
  const initialGiftId = searchParams.get("gift") || "";

  const {
    gifts,
    users,
    getUser,
    grantRecords,
    grantGiftToUser,
    bulkGrantGift,
  } = useAdminData();

  const [mode, setMode] = useState<"individual" | "bulk">("individual");
  const [selectedGiftId, setSelectedGiftId] = useState<string>(() => {
    if (initialGiftId && gifts.some((g) => g.id === initialGiftId)) {
      return initialGiftId;
    }
    return gifts[0]?.id || "";
  });
  const [selectedUserId, setSelectedUserId] = useState<string>(() => {
    if (initialUserId && users.some((u) => u.id === initialUserId)) {
      return initialUserId;
    }
    return users[0]?.id || "";
  });

  const selectedGift = gifts.find((g) => g.id === selectedGiftId);
  const selectedUser = users.find((u) => u.id === selectedUserId);
  const selectedUserDetail = selectedUserId
    ? getUser(selectedUserId)
    : undefined;

  // Check if selected user already owns the selected gift
  const alreadyOwns = useMemo(() => {
    if (!selectedUserDetail || !selectedGiftId) return false;
    return selectedUserDetail.ownedGifts.some(
      (g) => g.giftId === selectedGiftId,
    );
  }, [selectedUserDetail, selectedGiftId]);

  // Form inputs
  const [reason, setReason] = useState<string>(
    "تكريم مساهمة وتفاعل مميز في مجتمع Fury",
  );
  const [notifTitle, setNotifTitle] = useState<string>(
    selectedGift
      ? `تهانينا! حصلت على ${selectedGift.name}`
      : "تهانينا! حصلت على هدية جديدة",
  );
  const [notifBody, setNotifBody] = useState<string>(
    selectedGift
      ? `يسر إدارة Fury منحك هدية "${selectedGift.name}" تقديراً لمشاركاتك وتفاعلك الراقي مع المنصة.`
      : "يسر إدارة Fury منحك هدية تقديرية لحسابك.",
  );

  const [notice, setNotice] = useState<{
    type: "success" | "warning" | "info";
    title: string;
    description: string;
  } | null>(null);

  const [bulkConfirmOpen, setBulkConfirmOpen] = useState(false);

  // Bulk calculation
  const bulkStats = useMemo(() => {
    const totalUsers = users.length;
    const activeUsers = users.filter(
      (u) => u.status === "active" && u.role !== "admin",
    );
    const excludedCount = users.filter(
      (u) => u.status === "suspended" || u.role === "admin",
    ).length;

    const alreadyOwnedUsers = activeUsers.filter((u) => {
      const detail = getUser(u.id);
      return detail?.ownedGifts.some((g) => g.giftId === selectedGiftId);
    });

    const eligibleUsers = activeUsers.filter((u) => {
      const detail = getUser(u.id);
      return !detail?.ownedGifts.some((g) => g.giftId === selectedGiftId);
    });

    return {
      totalUsers,
      excludedCount,
      alreadyOwnedCount: alreadyOwnedUsers.length,
      finalRecipientsCount: eligibleUsers.length,
    };
  }, [users, selectedGiftId, getUser]);

  // Handle gift selection change to auto-update notification text
  const handleGiftChange = (id: string) => {
    setSelectedGiftId(id);
    const g = gifts.find((item) => item.id === id);
    if (g) {
      setNotifTitle(`تهانينا! حصلت على ${g.name}`);
      setNotifBody(
        `يسر إدارة Fury منحك هدية "${g.name}" تقديراً لمشاركاتك وتفاعلك الراقي مع المنصة.`,
      );
    }
  };

  const handleIndividualGrant = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!selectedGift || !selectedUser) return;
    if (alreadyOwns) {
      setNotice({
        type: "warning",
        title: "تعذر المنح",
        description: "المستخدم يمتلك هذه الهدية مسبقاً، لا يمكن تكرار المنح.",
      });
      return;
    }

    grantGiftToUser({
      giftId: selectedGift.id,
      userId: selectedUser.id,
      reason: reason.trim() || "هدية تقديرية من الإدارة",
      notificationTitle: notifTitle.trim(),
      notificationBody: notifBody.trim(),
    });

    setNotice({
      type: "success",
      title: "تم منح الهدية بنجاح",
      description: `تم منح "${selectedGift.name}" للمستخدم (${selectedUser.name}) وتم إرسال الإشعار لمركزه التنبيهي.`,
    });
  };

  const handleConfirmBulkGrant = () => {
    if (!selectedGift) return;
    const res = bulkGrantGift({
      giftId: selectedGift.id,
      reason: reason.trim() || "منح جماعي لجميع المستخدمين المؤهلين",
      notificationTitle: notifTitle.trim(),
      notificationBody: notifBody.trim(),
    });

    setNotice({
      type: "success",
      title: "تم المنح الجماعي بنجاح",
      description: `تم منح "${selectedGift.name}" بنجاح لعدد ${String(res.grantedCount)} مستخدم نشط مؤهل.`,
    });
    setBulkConfirmOpen(false);
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

      {/* Grant Action Card */}
      <div className={styles["grantCard"]}>
        <div className={styles["tabsRow"]}>
          <button
            type="button"
            onClick={() => {
              setMode("individual");
            }}
            className={cn(
              styles["tabBtn"],
              mode === "individual" && styles["tabBtnActive"],
            )}
          >
            <Gift style={{ width: "1rem", height: "1rem" }} />
            منح فردي لمستخدم محدد
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("bulk");
            }}
            className={cn(
              styles["tabBtn"],
              mode === "bulk" && styles["tabBtnActive"],
            )}
          >
            <Users style={{ width: "1rem", height: "1rem" }} />
            منح جماعي عام
          </button>
        </div>

        {mode === "individual" ? (
          <form onSubmit={handleIndividualGrant} className={styles["formGrid"]}>
            <div className={styles["formGrid2"]}>
              <div className={styles["field"]}>
                <label htmlFor="select-gift" className={styles["label"]}>
                  اختر الهدية المراد منحها
                  <span className={styles["requiredMark"]}>*</span>
                </label>
                <select
                  id="select-gift"
                  className={styles["select"]}
                  value={selectedGiftId}
                  onChange={(e) => {
                    handleGiftChange(e.target.value);
                  }}
                >
                  {gifts.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name} ({ADMIN_GIFT_TYPE_LABELS[g.type]})
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles["field"]}>
                <label htmlFor="select-user" className={styles["label"]}>
                  المستخدم المستلم
                  <span className={styles["requiredMark"]}>*</span>
                </label>
                <select
                  id="select-user"
                  className={styles["select"]}
                  value={selectedUserId}
                  onChange={(e) => {
                    setSelectedUserId(e.target.value);
                  }}
                >
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.email})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Duplicate Prevention Warning */}
            {alreadyOwns && (
              <div className={styles["warningBox"]}>
                <AlertTriangle
                  style={{ width: "1.25rem", height: "1.25rem", flexShrink: 0 }}
                />
                <span>
                  <strong>تنبيه:</strong> المستخدم ({selectedUser?.name}) يمتلك
                  هدية «{selectedGift?.name}» مسبقاً في حسابه. لا يمكن منح
                  الهدية مرتين لنفس المستخدم منعاً للتكرار.
                </span>
              </div>
            )}

            <div className={styles["field"]}>
              <label htmlFor="grant-reason" className={styles["label"]}>
                سبب المنح (لأغراض التوثيق الإداري)
                <span className={styles["requiredMark"]}>*</span>
              </label>
              <input
                id="grant-reason"
                type="text"
                className={styles["input"]}
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                }}
                placeholder="مثال: تكريم القارئ الأكثر تفاعلاً في الشهر"
              />
            </div>

            {/* In-app Notification Customization */}
            <div className={styles["formGrid2"]}>
              <div className={styles["field"]}>
                <label htmlFor="notif-title" className={styles["label"]}>
                  عنوان الإشعار داخل التطبيق
                  <span className={styles["requiredMark"]}>*</span>
                </label>
                <input
                  id="notif-title"
                  type="text"
                  className={styles["input"]}
                  value={notifTitle}
                  onChange={(e) => {
                    setNotifTitle(e.target.value);
                  }}
                />
              </div>

              <div className={styles["field"]}>
                <label htmlFor="notif-body" className={styles["label"]}>
                  نص الإشعار المرسل للمستخدم
                  <span className={styles["requiredMark"]}>*</span>
                </label>
                <input
                  id="notif-body"
                  type="text"
                  className={styles["input"]}
                  value={notifBody}
                  onChange={(e) => {
                    setNotifBody(e.target.value);
                  }}
                />
              </div>
            </div>

            {/* Notification Live Preview Card */}
            <div className={styles["notifPreviewBox"]}>
              <div className={styles["notifPreviewHeader"]}>
                <span className={styles["notifPreviewTitle"]}>
                  <Bell
                    style={{
                      width: "1rem",
                      height: "1rem",
                      color: "var(--primary)",
                    }}
                  />
                  معاينة الإشعار في مركز تنبيهات القارئ:
                </span>
                <span
                  style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.4)" }}
                >
                  الآن • Fury
                </span>
              </div>
              <h4
                style={{
                  margin: "0 0 0.25rem",
                  color: "#ffffff",
                  fontSize: "0.875rem",
                  fontWeight: 700,
                }}
              >
                {notifTitle}
              </h4>
              <p className={styles["notifPreviewBody"]}>{notifBody}</p>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                type="submit"
                disabled={alreadyOwns || !selectedGift || !selectedUser}
                className={styles["btnPrimary"]}
              >
                <Send style={{ width: "1rem", height: "1rem" }} />
                تأكيد ومنح الهدية
              </button>
            </div>
          </form>
        ) : (
          /* Bulk Grant Mode */
          <div className={styles["formGrid"]}>
            <div className={styles["field"]}>
              <label htmlFor="bulk-gift" className={styles["label"]}>
                اختر الهدية المراد منحها للجميع
                <span className={styles["requiredMark"]}>*</span>
              </label>
              <select
                id="bulk-gift"
                className={styles["select"]}
                value={selectedGiftId}
                onChange={(e) => {
                  handleGiftChange(e.target.value);
                }}
              >
                {gifts.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name} ({ADMIN_GIFT_TYPE_LABELS[g.type]})
                  </option>
                ))}
              </select>
            </div>

            {/* Real-time breakdown card */}
            <div className={styles["calcCard"]}>
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <Info
                  style={{
                    width: "1.125rem",
                    height: "1.125rem",
                    color: "var(--primary)",
                  }}
                />
                <h3
                  style={{
                    margin: 0,
                    fontSize: "0.9375rem",
                    fontWeight: 750,
                    color: "#fff",
                  }}
                >
                  حسابات المستلمين المؤهلين
                </h3>
              </div>

              <div className={styles["calcGrid"]}>
                <div className={styles["calcItem"]}>
                  <span className={styles["calcValue"]}>
                    {String(bulkStats.totalUsers)}
                  </span>
                  <span className={styles["calcLabel"]}>إجمالي المسجلين</span>
                </div>
                <div className={styles["calcItem"]}>
                  <span
                    className={styles["calcValue"]}
                    style={{ color: "#f87171" }}
                  >
                    -{String(bulkStats.excludedCount)}
                  </span>
                  <span className={styles["calcLabel"]}>
                    مستبعدون (موقوف/إدارة)
                  </span>
                </div>
                <div className={styles["calcItem"]}>
                  <span
                    className={styles["calcValue"]}
                    style={{ color: "#ffb300" }}
                  >
                    -{String(bulkStats.alreadyOwnedCount)}
                  </span>
                  <span className={styles["calcLabel"]}>يمتلكونها مسبقاً</span>
                </div>
                <div
                  className={styles["calcItem"]}
                  style={{
                    border: "1px solid var(--primary)",
                    background: "rgba(255, 71, 71, 0.08)",
                  }}
                >
                  <span
                    className={styles["calcValue"]}
                    style={{ color: "var(--primary)" }}
                  >
                    {String(bulkStats.finalRecipientsCount)}
                  </span>
                  <span
                    className={styles["calcLabel"]}
                    style={{ color: "#ffffff", fontWeight: 700 }}
                  >
                    العدد النهائي للمستلمين
                  </span>
                </div>
              </div>
            </div>

            <div className={styles["field"]}>
              <label htmlFor="bulk-reason" className={styles["label"]}>
                سبب المنح الجماعي
              </label>
              <input
                id="bulk-reason"
                type="text"
                className={styles["input"]}
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                }}
                placeholder="مثال: احتفال بمرور عام على المنصة أو فعالية الصيف"
              />
            </div>

            {/* Notification Live Preview Card */}
            <div className={styles["notifPreviewBox"]}>
              <div className={styles["notifPreviewHeader"]}>
                <span className={styles["notifPreviewTitle"]}>
                  <Bell
                    style={{
                      width: "1rem",
                      height: "1rem",
                      color: "var(--primary)",
                    }}
                  />
                  معاينة إشعار المنح الجماعي:
                </span>
                <span
                  style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.4)" }}
                >
                  إشعار عام لجميع المؤهلين
                </span>
              </div>
              <h4
                style={{
                  margin: "0 0 0.25rem",
                  color: "#ffffff",
                  fontSize: "0.875rem",
                  fontWeight: 700,
                }}
              >
                {notifTitle}
              </h4>
              <p className={styles["notifPreviewBody"]}>{notifBody}</p>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={() => {
                  setBulkConfirmOpen(true);
                }}
                disabled={bulkStats.finalRecipientsCount === 0 || !selectedGift}
                className={styles["btnPrimary"]}
              >
                <Users style={{ width: "1rem", height: "1rem" }} />
                بدء المنح الجماعي ({String(bulkStats.finalRecipientsCount)}{" "}
                مستخدم)
              </button>
            </div>
          </div>
        )}
      </div>

      <AdminGiftGrantHistory grantRecords={grantRecords} />

      {/* Bulk Grant Confirmation Dialog */}
      <AdminConfirmDialog
        isOpen={bulkConfirmOpen}
        title="تأكيد المنح الجماعي للهدايا"
        description={`هل أنت متأكد من رغبتك في منح هدية "${selectedGift?.name ?? ""}" لعدد (${String(bulkStats.finalRecipientsCount)}) مستخدم مؤهل دفعة واحدة؟ سيتم إنشاء إشعار لكل مستخدم في حسابه.`}
        confirmLabel="تأكيد المنح للجميع"
        cancelLabel="إلغاء"
        onConfirm={handleConfirmBulkGrant}
        onCancel={() => {
          setBulkConfirmOpen(false);
        }}
      />
    </div>
  );
}
