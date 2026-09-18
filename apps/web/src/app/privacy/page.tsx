import type { Metadata } from "next";

import { PrivacyPolicyPage } from "@/features/legal/components/PrivacyPolicyPage/PrivacyPolicyPage";

export const metadata: Metadata = {
  title: "سياسة الخصوصية",
  description: "مسودة سياسة الخصوصية لمنصة Fury.",
};

export default function PrivacyPage() {
  return <PrivacyPolicyPage />;
}
