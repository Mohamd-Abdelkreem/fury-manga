import type { ReactNode } from "react";
import { connection } from "next/server";
import { PublicWorkBoundary } from "@/features/public-catalog/components/PublicWorkBoundary";

export default async function WorkTemplate({
  children,
}: Readonly<{ children: ReactNode }>) {
  await connection();
  return (
    <PublicWorkBoundary renderId={crypto.randomUUID()}>
      {children}
    </PublicWorkBoundary>
  );
}
