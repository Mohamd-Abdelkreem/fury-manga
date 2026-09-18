import type { Metadata } from "next";

import { CategoriesDirectory } from "@/features/categories/components/CategoriesDirectory/CategoriesDirectory";
import { Footer } from "@/features/home/components/Footer/Footer";
import { Navbar } from "@/features/home/components/Navbar/Navbar";

export const metadata: Metadata = {
  title: "التصنيفات",
  description: "دليل تصنيفات الأعمال المتاحة على Fury.",
};

export default function CategoriesPage() {
  return (
    <>
      <Navbar />
      <CategoriesDirectory />
      <Footer />
    </>
  );
}
