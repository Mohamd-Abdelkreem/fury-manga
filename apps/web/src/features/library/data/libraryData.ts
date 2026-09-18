export type LibraryWork = Readonly<{
  id: string;
  title: string;
  contentType: "illustrated" | "text";
  cover: string;
  status: "ongoing" | "completed" | "archived";
  latestChapter: string;
  detailsHref: string;
  continueHref?: string;
}>;

export const LIBRARY_WORKS: readonly LibraryWork[] = [
  {
    id: "illustrated-trait-hoarder",
    title: "Trait Hoarder",
    contentType: "illustrated",
    cover: "/anime/341452.jpg",
    status: "ongoing",
    latestChapter: "الفصل 43",
    detailsHref: "/story/trait-hoarder",
    continueHref: "/story/trait-hoarder/chapter/42",
  },
  {
    id: "text-city-of-amber",
    title: "مدينة الكهرمان",
    contentType: "text",
    cover: "/anime/463592.jpg",
    status: "ongoing",
    latestChapter: "الفصل 6",
    detailsHref: "/story/city-of-amber",
    continueHref: "/story/city-of-amber/chapter/3",
  },
  {
    id: "text-paper-moon",
    title: "قمر من ورق",
    contentType: "text",
    cover: "/anime/472451.jpg",
    status: "completed",
    latestChapter: "الجزء 3",
    detailsHref: "/story/paper-moon",
  },
  {
    id: "text-archive-of-ash",
    title: "أرشيف الرماد",
    contentType: "text",
    cover: "/anime/384226.jpg",
    status: "archived",
    latestChapter: "الفصل 4",
    detailsHref: "/story/archive-of-ash",
    continueHref: "/story/archive-of-ash/chapter/2",
  },
] as const;
