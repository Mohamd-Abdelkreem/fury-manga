export interface Chapter {
  number: string;
  date: string;
  url: string;
}

export interface SimilarWork {
  id: number;
  title: string;
  chapter: string;
  rating: number;
  image: string;
  flag: string;
  type: string;
}

export interface StoryDetailData {
  id: string;
  title: string;
  alternativeTitles: string;
  description: string;
  author: string;
  artist: string;
  publisher: string;
  translator: string;
  genres: string[];
  status: string;
  type: string;
  views: string;
  rating: number;
  ratingCount: number;
  bookmarkedBy: number;
  publishedDate: string;
  lastUpdated: string;
  bannerImage: string;
  coverImage: string;
  chapters: Chapter[];
  similarWorks: SimilarWork[];
}

export const STORY_DETAIL: StoryDetailData = {
  id: "trait-hoarder",
  title: "Trait Hoarder",
  alternativeTitles:
    "특성 쌓는 김전사 , سمة المكتنز , المحارب كيم يبني الخصائص",
  description:
    "[من الاستوديو الذي قدم لك <عودة طائفة جبل هوا>!] كيم جونسو، مصنف مجاني في لعبة الهاتف المحمول “سيول الغامضة”، وهو الشخصية التعليمية للعبة، المحارب كيم! عليه أن يعيش في عالم لا يرحم كشخصية أساسية. كل ما عليه أن يثق به هو معرفته باللعبة كمصنف وقدرة المحارب كيم على تبديل السمات إلى أجل غير مسمى!",
  author: "LICO",
  artist: "LICO",
  publisher: "Naver Webtoon (Naver)",
  translator: "Fury",
  genres: [
    "أكشن",
    "ألعاب",
    "حياة مدرسية",
    "خيال",
    "سحر",
    "شريحة من الحياة",
    "شونين",
    "عوالم",
    "غموض",
    "فنتازيا",
    "فنون قتالية",
    "قوى خارقة",
    "مغامرات",
    "نظام",
    "وحوش",
  ],
  status: "Ongoing",
  type: "Manhwa",
  views: "223.3K",
  rating: 10,
  ratingCount: 10,
  bookmarkedBy: 285,
  publishedDate: "سبتمبر 21, 2024",
  lastUpdated: "أبريل 12, 2026",
  bannerImage:
    "https://images.unsplash.com/photo-1620336655055-088d06e36bf0?w=1200&h=400&fit=crop",
  coverImage:
    "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=300&h=420&fit=crop",
  chapters: [
    {
      number: "43",
      date: "أبريل 12, 2026",
      url: "/story/trait-hoarder/chapter/43",
    },
    {
      number: "42",
      date: "يناير 7, 2026",
      url: "/story/trait-hoarder/chapter/42",
    },
    {
      number: "41",
      date: "يناير 7, 2026",
      url: "/story/trait-hoarder/chapter/41",
    },
    {
      number: "40",
      date: "نوفمبر 2, 2025",
      url: "/story/trait-hoarder/chapter/40",
    },
    {
      number: "39",
      date: "سبتمبر 7, 2025",
      url: "/story/trait-hoarder/chapter/39",
    },
    {
      number: "38",
      date: "مايو 18, 2025",
      url: "/story/trait-hoarder/chapter/38",
    },
    {
      number: "37",
      date: "مايو 12, 2025",
      url: "/story/trait-hoarder/chapter/37",
    },
    {
      number: "36",
      date: "مايو 3, 2025",
      url: "/story/trait-hoarder/chapter/36",
    },
    {
      number: "35",
      date: "أبريل 25, 2025",
      url: "/story/trait-hoarder/chapter/35",
    },
    {
      number: "34",
      date: "أبريل 25, 2025",
      url: "/story/trait-hoarder/chapter/34",
    },
    {
      number: "33",
      date: "أبريل 12, 2025",
      url: "/story/trait-hoarder/chapter/33",
    },
    {
      number: "32",
      date: "أبريل 7, 2025",
      url: "/story/trait-hoarder/chapter/32",
    },
    {
      number: "31",
      date: "مارس 24, 2025",
      url: "/story/trait-hoarder/chapter/31",
    },
    {
      number: "30",
      date: "مارس 19, 2025",
      url: "/story/trait-hoarder/chapter/30",
    },
    {
      number: "29",
      date: "مارس 19, 2025",
      url: "/story/trait-hoarder/chapter/29",
    },
    {
      number: "28",
      date: "مارس 14, 2025",
      url: "/story/trait-hoarder/chapter/28",
    },
    {
      number: "27",
      date: "مارس 14, 2025",
      url: "/story/trait-hoarder/chapter/27",
    },
    {
      number: "26",
      date: "فبراير 13, 2025",
      url: "/story/trait-hoarder/chapter/26",
    },
    {
      number: "25",
      date: "فبراير 9, 2025",
      url: "/story/trait-hoarder/chapter/25",
    },
    {
      number: "24",
      date: "فبراير 8, 2025",
      url: "/story/trait-hoarder/chapter/24",
    },
    {
      number: "23",
      date: "يناير 24, 2025",
      url: "/story/trait-hoarder/chapter/23",
    },
    {
      number: "22",
      date: "يناير 19, 2025",
      url: "/story/trait-hoarder/chapter/22",
    },
    {
      number: "21",
      date: "يناير 14, 2025",
      url: "/story/trait-hoarder/chapter/21",
    },
    {
      number: "20",
      date: "يناير 12, 2025",
      url: "/story/trait-hoarder/chapter/20",
    },
    {
      number: "19",
      date: "يناير 5, 2025",
      url: "/story/trait-hoarder/chapter/19",
    },
    {
      number: "18",
      date: "ديسمبر 23, 2024",
      url: "/story/trait-hoarder/chapter/18",
    },
    {
      number: "17",
      date: "ديسمبر 19, 2024",
      url: "/story/trait-hoarder/chapter/17",
    },
    {
      number: "16",
      date: "ديسمبر 10, 2024",
      url: "/story/trait-hoarder/chapter/16",
    },
    {
      number: "15",
      date: "نوفمبر 30, 2024",
      url: "/story/trait-hoarder/chapter/15",
    },
    {
      number: "14",
      date: "نوفمبر 30, 2024",
      url: "/story/trait-hoarder/chapter/14",
    },
    {
      number: "13",
      date: "نوفمبر 30, 2024",
      url: "/story/trait-hoarder/chapter/13",
    },
    {
      number: "12",
      date: "نوفمبر 30, 2024",
      url: "/story/trait-hoarder/chapter/12",
    },
    {
      number: "11",
      date: "نوفمبر 30, 2024",
      url: "/story/trait-hoarder/chapter/11",
    },
    {
      number: "10",
      date: "نوفمبر 30, 2024",
      url: "/story/trait-hoarder/chapter/10",
    },
    {
      number: "9",
      date: "نوفمبر 30, 2024",
      url: "/story/trait-hoarder/chapter/9",
    },
    {
      number: "8",
      date: "نوفمبر 30, 2024",
      url: "/story/trait-hoarder/chapter/8",
    },
    {
      number: "7",
      date: "نوفمبر 30, 2024",
      url: "/story/trait-hoarder/chapter/7",
    },
    {
      number: "6",
      date: "نوفمبر 30, 2024",
      url: "/story/trait-hoarder/chapter/6",
    },
    {
      number: "5",
      date: "نوفمبر 30, 2024",
      url: "/story/trait-hoarder/chapter/5",
    },
    {
      number: "4",
      date: "نوفمبر 30, 2024",
      url: "/story/trait-hoarder/chapter/4",
    },
    {
      number: "3",
      date: "نوفمبر 30, 2024",
      url: "/story/trait-hoarder/chapter/3",
    },
    {
      number: "02",
      date: "نوفمبر 30, 2024",
      url: "/story/trait-hoarder/chapter/02",
    },
    {
      number: "01",
      date: "أكتوبر 26, 2024",
      url: "/story/trait-hoarder/chapter/01",
    },
  ],
  similarWorks: [
    {
      id: 101,
      title: "Revenge of the Iron-Blooded Sword Hound",
      chapter: "166",
      rating: 9,
      image:
        "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=300&h=420&fit=crop&auto=format",
      flag: "🇰🇷",
      type: "Manhwa",
    },
    {
      id: 102,
      title: "I Became the Successor of the Martial King",
      chapter: "12",
      rating: 10,
      image:
        "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=300&h=420&fit=crop&auto=format",
      flag: "🇰🇷",
      type: "Manhwa",
    },
    {
      id: 103,
      title: "cosmic heavenly demon 3077",
      chapter: "33",
      rating: 10,
      image:
        "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&h=420&fit=crop&auto=format",
      flag: "🇰🇷",
      type: "Manhwa",
    },
    {
      id: 104,
      title: "Standard of Reincarnation",
      chapter: "140",
      rating: 9,
      image:
        "https://images.unsplash.com/photo-1614583225146-5177e6fbbe7a?w=300&h=420&fit=crop&auto=format",
      flag: "🇰🇷",
      type: "Manhwa",
    },
    {
      id: 105,
      title: "Mirror Prepayment",
      chapter: "7",
      rating: 9,
      image:
        "https://images.unsplash.com/photo-1563089145-599997674d42?w=300&h=420&fit=crop&auto=format",
      flag: "🇰🇷",
      type: "Manhwa",
    },
    {
      id: 106,
      title: "Sword dance online",
      chapter: "55",
      rating: 9,
      image:
        "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&h=420&fit=crop&auto=format",
      flag: "🇨🇳",
      type: "Manhua",
    },
    {
      id: 107,
      title: "The Lord of the Wheel of Destiny",
      chapter: "14",
      rating: 8.5,
      image:
        "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=300&h=420&fit=crop&auto=format",
      flag: "🇨🇳",
      type: "Manhua",
    },
  ],
};
