import type { Metadata } from "next";

import { TermsPage } from "@/features/legal/components/TermsPage/TermsPage";

export const metadata: Metadata = {
  title: "الشروط والأحكام",
  description: "مسودة الشروط والأحكام واتفاقية الاستخدام لمنصة Fury.",
};

export default function Page() {
  return <TermsPage />;
}
