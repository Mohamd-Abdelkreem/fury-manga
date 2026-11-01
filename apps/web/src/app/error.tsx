"use client";
import { PublicCatalogState } from "@/features/public-catalog/components/PublicCatalogState";

export default function ErrorPage({
  unstable_retry,
}: Readonly<{ unstable_retry: () => void }>) {
  return (
    <main className="state-page">
      <PublicCatalogState kind="unavailable" onRetry={unstable_retry} />
    </main>
  );
}
