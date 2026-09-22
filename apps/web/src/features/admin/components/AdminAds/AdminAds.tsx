"use client";

import React, { useState } from "react";
import {
  AlertTriangle,
  Edit2,
  Lock,
  Megaphone,
  Power,
  ShieldAlert,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdminData } from "../../context/admin-context";
import { useAdminDialogFocus } from "../../hooks/use-admin-dialog-focus";
import type { AdminAdPlacement } from "../../types/admin.types";
import { ADMIN_AD_PLACEMENT_LABELS } from "../../types/admin.types";
import { AdminPageHeader } from "../AdminPageHeader/AdminPageHeader";
import { AdminAdPlacementDialog } from "./AdminAdPlacementDialog";
import { AdminAdBlockPreviewModal } from "./AdminAdBlockPreviewModal";
import styles from "./AdminAds.module.css";

export function AdminAds() {
  const { globalAdsEnabled, toggleGlobalAds, adPlacements, updateAdPlacement } =
    useAdminData();

  const [confirmGlobalOpen, setConfirmGlobalOpen] = useState(false);
  const [editingPlacement, setEditingPlacement] =
    useState<AdminAdPlacement | null>(null);
  const [isAdBlockPreviewOpen, setIsAdBlockPreviewOpen] = useState(false);

  const {
    dialogRef: globalConfirmDialogRef,
    onDialogKeyDown: onGlobalConfirmDialogKeyDown,
  } = useAdminDialogFocus({
    isOpen: confirmGlobalOpen,
    onClose: () => {
      setConfirmGlobalOpen(false);
    },
  });

  const handleToggleGlobalConfirm = () => {
    toggleGlobalAds();
    setConfirmGlobalOpen(false);
  };

  const handleTogglePlacement = (placement: AdminAdPlacement) => {
    updateAdPlacement(placement.id, { enabled: !placement.enabled });
  };

  const handleSavePlacement = (
    id: string,
    updates: Partial<AdminAdPlacement>,
  ) => {
    updateAdPlacement(id, updates);
  };

  return (
    <div className={styles["container"]}>
      <AdminPageHeader
        breadcrumbs={[
          { label: "لوحة الإدارة", href: "/admin/dashboard" },
          { label: "إعدادات الإعلانات" },
        ]}
        title="إعدادات ومساحات الإعلانات"
        description="التحكم في المفتاح العام للإعلانات، إدارة المساحات والشبكات، ومراجعة ثوابت نظام النقاط وبوابات القراءة."
      />

      {/* Global Ads Switch Card */}
      <div className={styles["globalSwitchCard"]}>
        <div className={styles["globalSwitchInfo"]}>
          <div
            className={cn(
              styles["globalSwitchIconWrap"],
              globalAdsEnabled
                ? styles["globalSwitchIconWrapActive"]
                : styles["globalSwitchIconWrapDisabled"],
            )}
          >
            <Power size={24} />
          </div>
          <div className={styles["globalSwitchText"]}>
            <div className={styles["globalSwitchTitle"]}>
              <span>حالة الإعلانات العامة على مستوى المنصة</span>
              <span
                style={{
                  fontSize: "0.75rem",
                  padding: "0.2rem 0.6rem",
                  borderRadius: "9999px",
                  fontWeight: 700,
                  background: globalAdsEnabled
                    ? "rgba(34, 197, 94, 0.15)"
                    : "rgba(239, 68, 68, 0.15)",
                  color: globalAdsEnabled ? "#4ade80" : "#ff6b6b",
                  border: `1px solid ${
                    globalAdsEnabled
                      ? "rgba(34, 197, 94, 0.3)"
                      : "rgba(239, 68, 68, 0.3)"
                  }`,
                }}
              >
                {globalAdsEnabled ? "مفعلة وتعمل للزوار" : "معطلة مؤقتاً"}
              </span>
            </div>
            <div className={styles["globalSwitchDescription"]}>
              {globalAdsEnabled
                ? "الإعلانات مفعّلة حالياً عبر جميع المساحات والصفحات وفق قواعد عتبات القراءة. يمكنك استخدام هذا الزر كمفتاح طوارئ لتعطيل ظهور أي إعلانات فوراً."
                : "تم إيقاف عرض جميع الإعلانات في المنصة مؤقتاً. يستمر نظام احتساب نقاط القراءة في العمل في الخلفية للحفاظ على تسلسل القراء."}
            </div>
          </div>
        </div>

        <button
          type="button"
          className={cn(
            styles["globalSwitchBtn"],
            globalAdsEnabled
              ? styles["globalSwitchBtnActive"]
              : styles["globalSwitchBtnDisabled"],
          )}
          onClick={() => {
            setConfirmGlobalOpen(true);
          }}
        >
          <Power size={16} />
          <span>
            {globalAdsEnabled
              ? "تعطيل الإعلانات العامة (إيقاف)"
              : "تفعيل الإعلانات العامة"}
          </span>
        </button>
      </div>

      {/* Platform Invariant Points Rules (Read-Only) */}
      <div className={styles["pointsCard"]}>
        <div className={styles["pointsHeader"]}>
          <div className={styles["pointsTitle"]}>
            <Zap size={20} className="text-primary" />
            <span>قواعد نظام النقاط وبوابات الإعلانات</span>
          </div>
          <div className={styles["invariantBadge"]}>
            <Lock size={12} />
            <span>ثوابت برمجية في بنية المنصة (للقراءة فقط)</span>
          </div>
        </div>

        <div className={styles["pointsGrid"]}>
          <div className={styles["pointRuleBox"]}>
            <span className={styles["pointRuleLabel"]}>
              معدل اكتساب النقاط (لكل فصل)
            </span>
            <span className={styles["pointRuleValue"]}>+3 نقاط</span>
            <span className={styles["pointRuleDesc"]}>
              تُمنح تلقائياً عند تجاوز القارئ نسبة 75% من صفحات أو نص الفصل
              الأول المقروء.
            </span>
          </div>

          <div className={styles["pointRuleBox"]}>
            <span className={styles["pointRuleLabel"]}>
              عتبة طلب الإعلان الإلزامي
            </span>
            <span className={styles["pointRuleValue"]}>9 نقاط</span>
            <span className={styles["pointRuleDesc"]}>
              بعد قراءة 3 فصول كاملة (3 × 3 = 9 نقاط)، يلزم عرض إعلان لفتح
              ومتابعة الفصل التالي.
            </span>
          </div>

          <div className={styles["pointRuleBox"]}>
            <span className={styles["pointRuleLabel"]}>
              استمرارية احتساب النقاط
            </span>
            <span className={styles["pointRuleValue"]}>تراكم مستمر</span>
            <span className={styles["pointRuleDesc"]}>
              تستمر نقاط القارئ في التراكم بسلاسة حتى لو تم تعطيل الإعلانات
              العامة أو استخدام مانع إعلانات.
            </span>
          </div>

          <div className={styles["pointRuleBox"]}>
            <span className={styles["pointRuleLabel"]}>
              الشبكة الإعلانية المعتمدة
            </span>
            <span className={styles["pointRuleValue"]}>Adsterra Network</span>
            <span className={styles["pointRuleDesc"]}>
              تدمج المنصة شفرات البانر والبوب-اندر عبر وسوم برمجية آمنة دون
              التأثير على تجربة القارئ.
            </span>
          </div>
        </div>
      </div>

      {/* Ad Placements Configuration Table */}
      <div className={styles["sectionCard"]}>
        <div className={styles["sectionHeader"]}>
          <div className={styles["sectionTitle"]}>
            <Megaphone size={20} className="text-primary" />
            <span>المساحات الإعلانية المتاحة ({adPlacements.length})</span>
          </div>

          <button
            type="button"
            className={styles["previewBtn"]}
            onClick={() => {
              setIsAdBlockPreviewOpen(true);
            }}
          >
            <ShieldAlert size={15} />
            <span>معاينة تنبيه مانع الإعلانات (AdBlock)</span>
          </button>
        </div>

        <div className={styles["tableWrapper"]}>
          <table className={styles["table"]}>
            <thead className={styles["thead"]}>
              <tr>
                <th className={styles["th"]}>المساحة الإعلانية</th>
                <th className={styles["th"]}>نوع الإعلان</th>
                <th className={styles["th"]}>الأبعاد</th>
                <th className={styles["th"]}>الكود البرمجي</th>
                <th className={styles["th"]}>الحالة</th>
                <th className={styles["th"]}>آخر تحديث</th>
                <th className={styles["th"]}>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {adPlacements.map((placement) => {
                const isEnabled = placement.enabled;

                return (
                  <tr key={placement.id} className={styles["tr"]}>
                    {/* Name & ID */}
                    <td className={styles["td"]}>
                      <div className={styles["placementNameCell"]}>
                        <span className={styles["placementName"]}>
                          {placement.name}
                        </span>
                        <span className={styles["placementId"]}>
                          #{placement.id}
                        </span>
                      </div>
                    </td>

                    {/* Type */}
                    <td className={styles["td"]}>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          color: "rgba(255, 255, 255, 0.8)",
                          background: "rgba(255, 255, 255, 0.05)",
                          padding: "0.2rem 0.6rem",
                          borderRadius: "9999px",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                        }}
                      >
                        {ADMIN_AD_PLACEMENT_LABELS[placement.type]}
                      </span>
                    </td>

                    {/* Dimensions */}
                    <td className={styles["td"]}>
                      <span
                        style={{
                          fontSize: "0.8125rem",
                          color: "rgba(255, 255, 255, 0.6)",
                          fontFamily: "monospace",
                        }}
                      >
                        {placement.dimensions ?? "تلقائي"}
                      </span>
                    </td>

                    {/* Snippet Escaped */}
                    <td className={styles["td"]}>
                      <div
                        className={styles["snippetSnippet"]}
                        title={placement.codeSnippet}
                      >
                        {placement.codeSnippet}
                      </div>
                    </td>

                    {/* Status */}
                    <td className={styles["td"]}>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          padding: "0.2rem 0.6rem",
                          borderRadius: "9999px",
                          background: isEnabled
                            ? "rgba(34, 197, 94, 0.15)"
                            : "rgba(255, 255, 255, 0.06)",
                          color: isEnabled
                            ? "#4ade80"
                            : "rgba(255, 255, 255, 0.4)",
                          border: `1px solid ${
                            isEnabled
                              ? "rgba(34, 197, 94, 0.3)"
                              : "rgba(255, 255, 255, 0.15)"
                          }`,
                        }}
                      >
                        {isEnabled ? "مفعل" : "معطل"}
                      </span>
                    </td>

                    {/* Updated At */}
                    <td className={styles["td"]}>
                      <span
                        style={{
                          fontSize: "0.8125rem",
                          color: "rgba(255, 255, 255, 0.45)",
                        }}
                      >
                        {placement.updatedAt}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className={styles["td"]}>
                      <div className={styles["actionsCell"]}>
                        <button
                          type="button"
                          className={styles["actionBtn"]}
                          onClick={() => {
                            setEditingPlacement(placement);
                          }}
                          title="تعديل الشفرة والإعدادات"
                        >
                          <Edit2 size={13} />
                          <span>تعديل</span>
                        </button>

                        <button
                          type="button"
                          className={cn(
                            styles["actionBtn"],
                            isEnabled && "text-destructive",
                          )}
                          onClick={() => {
                            handleTogglePlacement(placement);
                          }}
                          title={isEnabled ? "تعطيل المساحة" : "تفعيل المساحة"}
                        >
                          <Power size={13} />
                          <span>{isEnabled ? "تعطيل" : "تفعيل"}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Global Toggle Confirmation Modal */}
      {confirmGlobalOpen && (
        <div
          className={styles["modalBackdrop"]}
          onClick={() => {
            setConfirmGlobalOpen(false);
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-global-title"
        >
          <div
            ref={globalConfirmDialogRef}
            className={styles["modalContent"]}
            onKeyDown={onGlobalConfirmDialogKeyDown}
            tabIndex={-1}
            onClick={(e) => {
              e.stopPropagation();
            }}
            style={{ maxWidth: "480px" }}
          >
            <div className={styles["modalHeader"]}>
              <div className={styles["modalTitle"]} id="confirm-global-title">
                <AlertTriangle
                  size={18}
                  color={globalAdsEnabled ? "#ff4747" : "#4ade80"}
                />
                <span>
                  {globalAdsEnabled
                    ? "تأكيد تعطيل الإعلانات العامة"
                    : "تأكيد تفعيل الإعلانات العامة"}
                </span>
              </div>
            </div>
            <div className={styles["modalBody"]}>
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "rgba(255, 255, 255, 0.8)",
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {globalAdsEnabled
                  ? "هل أنت متأكد من تعطيل الإعلانات على مستوى المنصة بالكامل؟ لن تظهر أي إعلانات لزوار الموقع في كافة الصفحات والفصول حتى يتم إعادة تفعيلها."
                  : "هل أنت متأكد من تفعيل الإعلانات العامة؟ سيتم تفعيل المساحات الإعلانية المحددة وفق قواعد عتبات القراءة المعيارية."}
              </p>
            </div>
            <div className={styles["modalFooter"]}>
              <button
                type="button"
                className={styles["cancelBtn"]}
                onClick={() => {
                  setConfirmGlobalOpen(false);
                }}
              >
                إلغاء
              </button>
              <button
                type="button"
                className={cn(
                  styles["confirmBtn"],
                  globalAdsEnabled && styles["globalSwitchBtnActive"],
                )}
                onClick={handleToggleGlobalConfirm}
              >
                {globalAdsEnabled ? "تعطيل فوراً" : "تفعيل فوراً"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Placement Dialog */}
      <AdminAdPlacementDialog
        key={editingPlacement?.id ?? "none"}
        placement={editingPlacement}
        isOpen={Boolean(editingPlacement)}
        onClose={() => {
          setEditingPlacement(null);
        }}
        onSave={handleSavePlacement}
      />

      {/* AdBlock Preview Modal */}
      <AdminAdBlockPreviewModal
        isOpen={isAdBlockPreviewOpen}
        onClose={() => {
          setIsAdBlockPreviewOpen(false);
        }}
      />
    </div>
  );
}
