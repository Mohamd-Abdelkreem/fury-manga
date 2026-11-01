import type { Metadata } from "next";
import type { ReactNode } from "react";

import { AppProviders } from "@/app/providers";
import "@/styles/globals.css";
import "@/styles/integration.css";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: {
    default: "Fury",
    template: "%s | Fury",
  },
  description: "اكتشف المانجا والمانهوا والروايات والقصص المنشورة على Fury.",
};

type RootLayoutProps = Readonly<{ children: ReactNode }>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
