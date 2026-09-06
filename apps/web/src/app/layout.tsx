import type { Metadata } from "next";
import type { ReactNode } from "react";

import { AppProviders } from "@/app/providers";
import "@/styles/globals.css";
import "@/styles/integration.css";

export const metadata: Metadata = {
  title: {
    default: "Fury Turbo",
    template: "%s | Fury Turbo",
  },
  description:
    "An Arabic-first manga and manhwa reading experience with discovery, reading, and account tools.",
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
