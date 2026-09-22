import { Suspense } from "react";
import type { Metadata } from "next";
import { AdminContact } from "@/features/admin/components/AdminContact/AdminContact";

export const metadata: Metadata = {
  title: "رسائل التواصل",
  description: "صندوق رسائل واستفسارات القراء وفرق العمل في منصة Fury",
};

export default function AdminContactPage() {
  return (
    <Suspense
      fallback={
        <div style={{ padding: "2rem", color: "rgba(255,255,255,0.6)" }}>
          جاري تحميل رسائل التواصل...
        </div>
      }
    >
      <AdminContact />
    </Suspense>
  );
}
