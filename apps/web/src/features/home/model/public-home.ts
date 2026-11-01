import type { CatalogWork } from "@fury/contracts";
import { workTypeLabels } from "@/features/public-catalog/model/public-catalog.presentation";

export type PublicHeroItem = ReturnType<typeof publicHeroItem>;
export const publicHeroItem = (work: CatalogWork) => ({
  id: work.slug,
  title: work.title,
  titleAccent: work.alternativeTitle ?? "",
  description: "اعرض تفاصيل هذا العمل وما يتوفر من فصوله.",
  flag: "",
  genre: work.categories[0]?.displayName ?? "",
  badge: workTypeLabels[work.type],
});
