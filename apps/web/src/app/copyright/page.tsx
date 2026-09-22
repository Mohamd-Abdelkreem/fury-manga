import type { Metadata } from "next";

import { CopyrightPage } from "@/features/legal/components/CopyrightPage/CopyrightPage";

export const metadata: Metadata = {
  title: "حقوق الملكية الفكرية",
  description: "سياسة حقوق الملكية الفكرية وإخطارات إزالة المحتوى لمنصة Fury.",
};

export default function Page() {
  return <CopyrightPage />;
}
