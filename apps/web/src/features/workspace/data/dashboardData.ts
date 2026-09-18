export type ContinueReadingItem = Readonly<{
  id: string;
  title: string;
  cover: string;
  chapter: string;
  progress: number;
  href: string;
}>;

export type SavedWorkPreview = Readonly<{
  id: string;
  title: string;
  cover: string;
  kind: "illustrated" | "text";
}>;

export type DashboardFixture = Readonly<{
  points: number;
  continueReading: readonly ContinueReadingItem[];
  savedWorks: readonly SavedWorkPreview[];
  bookmarkCount: number;
  activeFrameId: string | null;
  activeDecorationId: string | null;
}>;

export const DASHBOARD_FIXTURE: DashboardFixture = {
  points: 1840,
  continueReading: [
    {
      id: "trait-hoarder-43",
      title: "Trait Hoarder",
      cover: "/anime/341452.jpg",
      chapter: "الفصل 43",
      progress: 68,
      href: "/story/trait-hoarder/chapter/43",
    },
  ],
  savedWorks: [
    {
      id: "trait-hoarder",
      title: "Trait Hoarder",
      cover: "/anime/341452.jpg",
      kind: "illustrated",
    },
    {
      id: "city-of-amber",
      title: "مدينة الكهرمان",
      cover: "/anime/463592.jpg",
      kind: "text",
    },
    {
      id: "paper-moon",
      title: "قمر من ورق",
      cover: "/anime/472451.jpg",
      kind: "text",
    },
  ],
  bookmarkCount: 4,
  activeFrameId: "ember-ring",
  activeDecorationId: "ember-note",
};
