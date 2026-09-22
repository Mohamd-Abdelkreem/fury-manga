export type StoryComment = Readonly<{
  id: number | string;
  user: string;
  date: string;
  content: string;
  avatar?: string;
  likes?: number;
  likedByViewer?: boolean;
  isOwn?: boolean;
  deleted?: boolean;
  reported?: boolean;
}>;

export const STORY_COMMENTS: readonly StoryComment[] = [
  {
    id: 1,
    user: "محمد أحمد",
    date: "منذ ساعتين",
    content:
      "القصة أسطورية والترجمة رائعة كالعادة. شكرًا لكم على المجهود، وبانتظار الفصول القادمة.",
    likes: 12,
  },
  {
    id: 2,
    user: "خالد الحربي",
    date: "منذ 5 ساعات",
    content:
      "تطور الأحداث غير متوقع، وأعجبني الإيقاع وطريقة بناء العالم داخل العمل.",
    likes: 8,
  },
  {
    id: 3,
    user: "قارئ Fury",
    date: "أمس",
    content: "من أفضل الأعمال التي أتابعها حاليًا، وبانتظار الفصل الجديد.",
    likes: 15,
    isOwn: true,
  },
];
