import type { MangaCardData } from "@/types";

export interface FilterOption {
  value: string;
  label: string;
}

export const DISCOVER_GENRES: FilterOption[] = [
  { value: "reincarnation", label: "إعادة أحياء" },
  { value: "action", label: "أكشن" },
  { value: "games", label: "ألعاب" },
  { value: "revenge", label: "انتقام" },
  { value: "thriller", label: "إثارة" },
  { value: "historical", label: "تاريخي" },
  { value: "crime", label: "جرائم" },
  { value: "harem", label: "حريم" },
  { value: "school_life", label: "حياة مدرسية" },
  { value: "fantasy", label: "خيال" },
  { value: "drama", label: "دراما" },
  { value: "horror", label: "رعب" },
  { value: "romance", label: "رومانسي" },
  { value: "slice_of_life", label: "شريحة من الحياة" },
  { value: "shoujo", label: "شوجو" },
  { value: "shounen", label: "شونين" },
  { value: "cultivation", label: "صقل" },
  { value: "cooking", label: "طبخ" },
  { value: "worlds", label: "عوالم" },
  { value: "mystery", label: "غموض" },
  { value: "martial_arts", label: "فنون قتالية" },
  { value: "superpowers", label: "قوى خارقة" },
  { value: "comedy", label: "كوميديا" },
  { value: "post_apocalyptic", label: "ما بعد نهاية العالم" },
  { value: "adventure", label: "مغامرات" },
  { value: "murim", label: "موريم" },
  { value: "system", label: "نظام" },
  { value: "psychological", label: "نفسي" },
  { value: "ninja", label: "نينجا" },
  { value: "monsters", label: "وحوش" },
];

export const DISCOVER_STATUSES: FilterOption[] = [
  { value: "", label: "الجميع" },
  { value: "ongoing", label: "Ongoing" },
  { value: "completed", label: "Completed" },
  { value: "hiatus", label: "Hiatus" },
];

export const DISCOVER_TYPES: FilterOption[] = [
  { value: "", label: "الجميع" },
  { value: "manga", label: "Manga" },
  { value: "manhwa", label: "Manhwa" },
  { value: "manhua", label: "Manhua" },
  { value: "comic", label: "Comic" },
  { value: "novel", label: "Novel" },
];

export const DISCOVER_ORDERS: FilterOption[] = [
  { value: "", label: "الأفتراضي" },
  { value: "title", label: "A-Z" },
  { value: "titlereverse", label: "Z-A" },
  { value: "update", label: "تحديث" },
  { value: "latest", label: "أضافة" },
  { value: "popular", label: "مشهورة" },
];

export const MOCK_DISCOVER_MANGA: MangaCardData[] = [
  {
    id: 101,
    title: "Wooden stick 99+",
    chapter: "49",
    rating: 9.0,
    flag: "🇰🇷",
    image: "/anime/341452.jpg",
    badge: "ملون",
  },
  {
    id: 102,
    title: "Boss 99",
    chapter: "14",
    rating: 9.0,
    flag: "🇰🇷",
    image: "/anime/366722.jpg",
    badge: "ملون",
  },
  {
    id: 103,
    title: "A Bad Person",
    chapter: "70",
    rating: 10.0,
    flag: "🇰🇷",
    image: "/anime/384226.jpg",
    badge: "ملون",
  },
  {
    id: 104,
    title: "A Boy Raised by the Ultimate Dragon",
    chapter: "3",
    rating: 10.0,
    flag: "🇰🇷",
    image: "/anime/411246.jpg",
    badge: "ملون",
  },
  {
    id: 105,
    title: "A Mercenary's Rebirth Among",
    chapter: "28",
    rating: 9.0,
    flag: "🇰🇷",
    image: "/anime/463379.jpg",
    badge: "ملون",
    isHot: true,
  },
  {
    id: 106,
    title: "Sorcerer's Curse",
    chapter: "76",
    rating: 4.6,
    flag: "🇰🇷",
    image: "/anime/463592.jpg",
    badge: "ملون",
  },
  {
    id: 107,
    title: "Ice Princess",
    chapter: "55",
    rating: 4.5,
    flag: "🇰🇷",
    image: "/anime/472451.jpg",
    isNew: true,
  },
  {
    id: 108,
    title: "Mountain Shepherd",
    chapter: "67",
    rating: 4.4,
    flag: "🇰🇷",
    image: "/anime/473048.jpg",
    badge: "ملون",
  },
  {
    id: 109,
    title: "World Emperor",
    chapter: "312",
    rating: 4.9,
    flag: "🇯🇵",
    image: "/anime/477473.jpg",
    isHot: true,
  },
  {
    id: 110,
    title: "Heir of Legends",
    chapter: "19",
    rating: 4.2,
    flag: "🇯🇵",
    image: "/anime/478748.jpg",
    isNew: true,
  },
];
