import type { Metadata } from "next";

import { LibraryScreen } from "@/features/library/components/LibraryScreen/LibraryScreen";

export const metadata: Metadata = {
  title: "المكتبة والمحفوظات",
};

export default function LibraryPage() {
  return <LibraryScreen />;
}
