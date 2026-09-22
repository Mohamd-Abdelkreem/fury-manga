"use client";

import { Eye, Megaphone, Monitor, Power, ShieldCheck } from "lucide-react";
import { useState } from "react";

import { AdvertisementSlot } from "@/features/advertising/components/AdvertisementSlot/AdvertisementSlot";
import { useAdminData } from "../../context/admin-context";
import { ADMIN_AD_PLACEMENT_LABELS } from "../../types/admin.types";
import { AdminConfirmDialog } from "../AdminConfirmDialog/AdminConfirmDialog";
import { AdminPageHeader } from "../AdminPageHeader/AdminPageHeader";
import { AdminAdBlockPreviewModal } from "./AdminAdBlockPreviewModal";
import styles from "./AdminAds.module.css";

export function AdminAds() {
  const { adPlacements, globalAdsEnabled, toggleGlobalAds, updateAdPlacement } =
    useAdminData();
  const [confirmGlobalToggle, setConfirmGlobalToggle] = useState(false);
  const [previewPlacement, setPreviewPlacement] = useState<
    "home-banner" | "catalog-banner" | null
  >(null);
  const [adBlockPreviewOpen, setAdBlockPreviewOpen] = useState(false);

  return (
    <div className={styles["page"]}>
      <AdminPageHeader
        breadcrumbs={[
          { label: "لوحة الإدارة", href: "/admin/dashboard" },
          { label: "إعدادات الإعلانات" },
        ]}
        title="إعدادات الإعلانات"
        description="إدارة موضعي البانر المعتمدين ومعاينة تجربتهما قبل ربط إعدادات المزود."
      />

      <section className={styles["statusCard"]}>
        <div className={styles["statusIcon"]}>
          <Power aria-hidden="true" />
        </div>
        <div>
          <h2>حالة الإعلانات العامة</h2>
          <p>
            {globalAdsEnabled
              ? "مفعلة للمواضع التي جرى تمكينها أدناه."
              : "معطلة مؤقتًا في جميع الصفحات المؤهلة."}
          </p>
        </div>
        <button
          type="button"
          className={styles["primaryAction"]}
          onClick={() => {
            setConfirmGlobalToggle(true);
          }}
        >
          {globalAdsEnabled
            ? "تعطيل الإعلانات العامة"
            : "تفعيل الإعلانات العامة"}
        </button>
      </section>

      <section className={styles["providerCard"]}>
        <div>
          <ShieldCheck aria-hidden="true" />
          <span>المزود</span>
          <strong>Adsterra</strong>
        </div>
        <div>
          <Monitor aria-hidden="true" />
          <span>حالة الإعداد</span>
          <strong>بانتظار الربط</strong>
        </div>
        <p>
          سيتم ربط معرفات المناطق وإعدادات المزود من بيئة التشغيل لاحقًا، من دون
          إدخال شفرات تنفيذية أو أسرار في لوحة الإدارة.
        </p>
      </section>

      <section aria-labelledby="placements-title">
        <div className={styles["sectionHeading"]}>
          <Megaphone aria-hidden="true" />
          <div>
            <h2 id="placements-title">المواضع المعتمدة</h2>
            <p>موضع واحد كحد أقصى في الصفحة المؤهلة.</p>
          </div>
        </div>
        <div className={styles["placementGrid"]}>
          {adPlacements.map((placement) => (
            <article className={styles["placementCard"]} key={placement.id}>
              <div className={styles["placementHeader"]}>
                <div>
                  <h3>{ADMIN_AD_PLACEMENT_LABELS[placement.type]}</h3>
                  <span>{placement.routes.join(" · ")}</span>
                </div>
                <button
                  type="button"
                  className={styles["toggle"]}
                  aria-pressed={placement.enabled}
                  onClick={() =>
                    updateAdPlacement(placement.id, {
                      enabled: !placement.enabled,
                    })
                  }
                >
                  {placement.enabled ? "تعطيل الموضع" : "تفعيل الموضع"}
                </button>
              </div>
              <dl>
                <div>
                  <dt>الأبعاد المتوقعة</dt>
                  <dd>{placement.dimensions}</dd>
                </div>
                <div>
                  <dt>حالة الإعداد</dt>
                  <dd>
                    {placement.configurationStatus === "configured"
                      ? "مكتمل"
                      : "بانتظار الربط"}
                  </dd>
                </div>
              </dl>
              <p>{placement.location}</p>
              <button
                type="button"
                className={styles["previewAction"]}
                onClick={() => {
                  setPreviewPlacement(placement.type);
                }}
              >
                <Eye aria-hidden="true" /> معاينة الموضع
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className={styles["adBlockCard"]}>
        <div>
          <h2>رسالة دعم Fury عند حجب الإعلان</h2>
          <p>رسالة غير منبثقة ولا تمنع الوصول إلى المحتوى.</p>
        </div>
        <button
          type="button"
          className={styles["previewAction"]}
          onClick={() => {
            setAdBlockPreviewOpen(true);
          }}
        >
          <Eye aria-hidden="true" /> معاينة تنبيه مانع الإعلانات
        </button>
      </section>

      {previewPlacement === null ? null : (
        <div className={styles["previewPanel"]}>
          <div className={styles["previewHeading"]}>
            <h2>معاينة {ADMIN_AD_PLACEMENT_LABELS[previewPlacement]}</h2>
            <button
              type="button"
              onClick={() => {
                setPreviewPlacement(null);
              }}
            >
              إغلاق المعاينة
            </button>
          </div>
          <AdvertisementSlot placement={previewPlacement} />
        </div>
      )}

      <AdminAdBlockPreviewModal
        isOpen={adBlockPreviewOpen}
        onClose={() => {
          setAdBlockPreviewOpen(false);
        }}
      />
      <AdminConfirmDialog
        isOpen={confirmGlobalToggle}
        title={
          globalAdsEnabled
            ? "تأكيد تعطيل الإعلانات العامة"
            : "تأكيد تفعيل الإعلانات العامة"
        }
        description="سيؤثر هذا التغيير على مواضع البانر المؤهلة فقط."
        confirmLabel={globalAdsEnabled ? "تعطيل الآن" : "تفعيل الآن"}
        cancelLabel="إلغاء"
        onConfirm={() => {
          toggleGlobalAds();
          setConfirmGlobalToggle(false);
        }}
        onCancel={() => {
          setConfirmGlobalToggle(false);
        }}
      />
    </div>
  );
}
