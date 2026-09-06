import type { HeroItem, Genre, NavLink } from "@/types";

export const NAV_LINKS: NavLink[] = [
  { label: "الرئيسية", href: "/" },
  { label: "المصنّف", href: "#" },
  { label: "قائمة المانجا", href: "/discover" },
  { label: "الأنمي", href: "#" },
];

export const GENRES: Genre[] = [
  { id: "all", label: "جميع المانجات" },
  { id: "action", label: "أكشن" },
  { id: "reincarnation", label: "إعادة أحياء" },
  { id: "revenge", label: "انتقام" },
  { id: "thriller", label: "إثارة" },
  { id: "games", label: "ألعاب" },
  { id: "videogames", label: "ألعاب فيديو" },
  { id: "adventure", label: "مغامرة" },
  { id: "fantasy", label: "خيال" },
  { id: "magic", label: "سحر" },
  { id: "comedy", label: "كوميدي" },
  { id: "romance", label: "رومانسي" },
  { id: "horror", label: "رعب" },
  { id: "sports", label: "رياضة" },
  { id: "scifi", label: "خيال علمي" },
  { id: "isekai", label: "إيساكاي" },
];

export const HERO_ITEMS: HeroItem[] = [
  {
    id: 1,
    title: "Dark Knight:",
    titleAccent: "Rise of the Emperor",
    image: "/anime/341452.jpg",
    characterImage: "/anime/341452.jpg",
    rating: 4.9,
    chapters: "120 فصل",
    reads: "2.5 مليون قراءة",
    description:
      "في عالم حيث الحرب لا تتوقف، يستيقظ فارس منسي ليجد نفسه يحمل سراً خطيراً يمكنه تغيير مصير المملكة بأسرها. رحلة ملحمية بين الخيانة والولاء.",
    flag: "🇯🇵",
    genre: "مانجا · أكشن",
    badge: "مميز الأسبوع",
  },
  {
    id: 2,
    title: "Magic Master:",
    titleAccent: "Shadow Commander",
    image: "/anime/366722.jpg",
    characterImage: "/anime/366722.jpg",
    rating: 4.8,
    chapters: "85 فصل",
    reads: "1.8 مليون قراءة",
    description:
      "بعد تجسده في عالم غريب مليء بالسحر والوحوش، يقرر بطلنا إخفاء قوته الحقيقية والعمل خلف الكواليس كقائد لمنظمة سرية تلاعب بالأقدار وتتحكم بمسارات العالم.",
    flag: "🇰🇷",
    genre: "مانهوا · سحر",
    badge: "الأكثر قراءة",
  },
  {
    id: 3,
    title: "King of Games:",
    titleAccent: "Legendary Challenger",
    image: "/anime/384226.jpg",
    characterImage: "/anime/384226.jpg",
    rating: 4.7,
    chapters: "142 فصل",
    reads: "3.2 مليون قراءة",
    description:
      "لاعب عبقري يُجبر على دخول لعبة واقع افتراضي مميتة. لحماية عائلته، يتعين عليه استخدام مهاراته الفريدة وذكائه الخارق لهزيمة زعماء الطوابق المئة والنجاة.",
    flag: "🇰🇷",
    genre: "مانهوا · ألعاب",
    badge: "شائع الآن",
  },
  {
    id: 4,
    title: "Sword Guardian:",
    titleAccent: "The Lost Hope",
    image: "/anime/411246.jpg",
    characterImage: "/anime/411246.jpg",
    rating: 4.9,
    chapters: "96 فصل",
    reads: "1.2 مليون قراءة",
    description:
      "بعد سقوط إمبراطورية النور، يشرع آخر حراس السيف الإمبراطوري في رحلة خطيرة لجمع شمل الحلفاء المشتتين وإعادة إحياء شعلة الأمل الأخيرة لمواجهة قوى الظلام.",
    flag: "🇯🇵",
    genre: "مانجا · مغامرة",
    badge: "جديد ومثير",
  },
];
