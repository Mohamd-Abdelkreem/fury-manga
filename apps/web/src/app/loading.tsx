import { PublicCatalogState } from "@/features/public-catalog/components/PublicCatalogState";

export default function Loading() {
  return (
    <main className="state-page">
      <PublicCatalogState kind="loading" />
    </main>
  );
}
