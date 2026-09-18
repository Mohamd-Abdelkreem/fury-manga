export type TextContentType = "novel" | "short-story";
export type TextWorkStatus = "ongoing" | "completed" | "hiatus" | "archived";

export type InlineText = Readonly<{
  text: string;
  bold?: boolean;
  italic?: boolean;
  href?: string;
}>;

export type TextBlock =
  | Readonly<{ type: "heading"; level: 2 | 3; text: string }>
  | Readonly<{ type: "paragraph"; content: readonly InlineText[] }>
  | Readonly<{ type: "quote"; text: string }>
  | Readonly<{ type: "list"; items: readonly string[] }>;

export type TextChapter = Readonly<{
  id: string;
  number: number;
  title: string;
  publishedAt: string;
  read: boolean;
  content: readonly TextBlock[];
}>;

export type FixtureComment = Readonly<{
  id: string;
  author: string;
  date: string;
  body: string;
}>;

export type TextWork = Readonly<{
  id: string;
  title: string;
  englishTitle?: string;
  alternativeTitles?: readonly string[];
  cover: string;
  banner?: string;
  description: string;
  categories: readonly string[];
  categorySlugs: readonly string[];
  author: string;
  status: TextWorkStatus;
  type: TextContentType;
  publishedAt: string;
  updatedAt: string;
  addedAt: string;
  rating?: number;
  ratingCount?: number;
  chapters: readonly TextChapter[];
  similarWorkIds: readonly string[];
  comments: readonly FixtureComment[];
  progressChapterId?: string;
}>;

const chapterContent = (
  chapterTitle: string,
  place: string,
): readonly TextBlock[] => [
  {
    type: "paragraph",
    content: [
      { text: "حين انطفأ آخر مصباح في " },
      { text: place, bold: true },
      {
        text: "، بقيت النافذة الوحيدة مضاءة كأنها عين لا تنام. لم يكن الصمت غيابًا للصوت، بل اتفاقًا مؤقتًا بين المدينة وأسرارها.",
      },
    ],
  },
  { type: "heading", level: 2, text: chapterTitle },
  {
    type: "paragraph",
    content: [
      {
        text: "سار يامن بمحاذاة الجدار القديم وهو يعيد ترتيب الرسالة في ذهنه. الكلمات القليلة التي قرأها قبل الغروب بدت الآن أثقل من الورق نفسه، وكل خطوة كانت تفتح احتمالًا جديدًا لا يشبه ما قبله. ",
      },
      { text: "لا تثق بالخريطة وحدها", italic: true },
      { text: "؛ هكذا انتهت الرسالة، وهكذا بدأ الطريق الحقيقي." },
    ],
  },
  {
    type: "quote",
    text: "الأبواب التي نخشى فتحها تعرف أسماءنا قبل أن نمد أيدينا إليها.",
  },
  {
    type: "paragraph",
    content: [
      {
        text: "في الساحة، كانت عربات الباعة تنسحب ببطء، تاركة وراءها رائحة القهوة والهيل. رفع يامن رأسه نحو برج الساعة؛ عقرب الدقائق متوقف، بينما كان الجرس يعلن وقتًا لا وجود له. أدرك أن عليه أن يختار قبل أن تصل الدورية إلى أول الزقاق.",
      },
    ],
  },
  {
    type: "list",
    items: [
      "المفتاح النحاسي الذي لا يفتح قفلًا معروفًا.",
      "نسخة الخريطة التي تتبدل حدودها بعد منتصف الليل.",
      "الاسم الذي مُحي من سجل المسافرين قبل عشرين عامًا.",
    ],
  },
  {
    type: "heading",
    level: 3,
    text: "ما وراء الباب",
  },
  {
    type: "paragraph",
    content: [
      {
        text: "عندما وضع المفتاح في التجويف الحجري، لم يسمع طقطقة قفل، بل صوت موج بعيد. انفرج الجدار عن ممر تناثرت فيه حروف مضيئة، وكل حرف منها كان يعرض ذكرى قصيرة لشخص لم يقابله قط. تردد لحظة، ثم تذكر أن العودة لم تعد طريقًا آمنًا.",
      },
    ],
  },
  {
    type: "paragraph",
    content: [
      { text: "يمكن للقارئ مراجعة " },
      {
        text: "تفاصيل العمل",
        bold: true,
        href: "/story/city-of-amber",
      },
      {
        text: " لفهم إشارات هذا الفصل، لكن الحكاية تترك عمدًا مساحة لما لم يُقل بعد. في نهاية الممر، كان هناك كرسيان، وعلى أحدهما جلس شخص يحمل وجه يامن نفسه.",
      },
    ],
  },
  {
    type: "paragraph",
    content: [
      {
        text: "امتد الحوار طويلًا بين الاحتمالين: أحدهما يريد إنقاذ المدينة ولو خسر ذاكرته، والآخر يرى أن الذاكرة هي المدينة الحقيقية. وبينما كان الفجر يقترب، بدأت الحروف على الجدران تنطفئ واحدة بعد أخرى، فصار القرار واضحًا وقاسيًا في آن واحد.",
      },
    ],
  },
  {
    type: "paragraph",
    content: [
      {
        text: "خرج يامن قبل أول خيط من الضوء، يحمل الخريطة مطوية على هيئة طائر. لم يعرف إن كان قد اختار الصواب، لكنه عرف أن الساعة في الساحة عادت إلى الحركة، وأن المدينة ستمنحه يومًا واحدًا فقط ليكمل ما بدأه.",
      },
    ],
  },
];

const makeChapters = (count: number, place: string): readonly TextChapter[] =>
  Array.from({ length: count }, (_, index) => {
    const number = index + 1;
    const title =
      [
        "الرسالة الأولى",
        "ممرّ الرماد",
        "ساعة بلا ظل",
        "حارس الباب",
        "المدينة الأخرى",
        "موعد مع الفجر",
      ][index % 6] ?? "الرسالة الأولى";
    return {
      id: String(number),
      number,
      title,
      publishedAt: `2026-0${String(Math.min(number, 9))}-${String(8 + number).padStart(2, "0")}`,
      read: number <= 2,
      content: chapterContent(`الفصل ${String(number)}: ${title}`, place),
    };
  });

const COMMENTS: readonly FixtureComment[] = [
  {
    id: "comment-1",
    author: "سلمى القارئة",
    date: "منذ ساعتين",
    body: "الإيقاع هادئ لكنه مشدود، ووصف المدينة جعل المشهد حاضرًا جدًا.",
  },
  {
    id: "comment-2",
    author: "أحمد نور",
    date: "أمس",
    body: "أحببت فكرة الخريطة المتغيرة. أتمنى أن نعرف أصل المفتاح في الفصل القادم.",
  },
];

export const TEXT_WORKS: readonly TextWork[] = [
  {
    id: "city-of-amber",
    title: "مدينة الكهرمان",
    englishTitle: "City of Amber",
    alternativeTitles: ["المدينة التي لا تنام"],
    cover: "/anime/463592.jpg",
    banner: "/anime/477473.jpg",
    description:
      "في مدينة تحفظ الذكريات داخل أحجار الكهرمان، يتلقى ناسخ خرائط رسالة من مستقبله تقوده إلى سرّ قادر على تغيير تاريخ المدينة وسكانها.",
    categories: ["خيال", "غموض", "مغامرات"],
    categorySlugs: ["fantasy", "mystery", "adventure"],
    author: "ليان السالم",
    status: "ongoing",
    type: "novel",
    publishedAt: "2025-11-02",
    updatedAt: "2026-09-12",
    addedAt: "2025-11-05",
    rating: 4.8,
    ratingCount: 312,
    chapters: makeChapters(6, "مدينة الكهرمان"),
    similarWorkIds: ["paper-moon", "last-lighthouse", "garden-of-echoes"],
    comments: COMMENTS,
    progressChapterId: "3",
  },
  {
    id: "paper-moon",
    title: "قمر من ورق",
    englishTitle: "Paper Moon",
    cover: "/anime/472451.jpg",
    description:
      "قصة قصيرة عن صانعة دمى تكتشف أن رسائل طفولتها تُعيد تشكيل الحي كلما قرأتها تحت ضوء القمر.",
    categories: ["دراما", "خيال"],
    categorySlugs: ["drama", "fantasy"],
    author: "مريم حجازي",
    status: "completed",
    type: "short-story",
    publishedAt: "2026-01-14",
    updatedAt: "2026-06-19",
    addedAt: "2026-01-14",
    rating: 4.4,
    ratingCount: 98,
    chapters: makeChapters(3, "حي الورّاقين"),
    similarWorkIds: ["city-of-amber", "garden-of-echoes"],
    comments: COMMENTS.slice(0, 1),
  },
  {
    id: "last-lighthouse",
    title: "منارة عند آخر البحر",
    englishTitle: "The Last Lighthouse",
    cover: "/anime/484571.jpg",
    description:
      "حارس منارة يدوّن أسماء السفن التي لا تصل أبدًا، حتى يجد اسمه بينها.",
    categories: ["غموض", "رعب"],
    categorySlugs: ["mystery", "horror"],
    author: "سامي الرفاعي",
    status: "ongoing",
    type: "novel",
    publishedAt: "2026-02-03",
    updatedAt: "2026-09-08",
    addedAt: "2026-02-03",
    rating: 4.6,
    ratingCount: 151,
    chapters: makeChapters(5, "المنارة الأخيرة"),
    similarWorkIds: ["city-of-amber", "archive-of-ash"],
    comments: COMMENTS,
  },
  {
    id: "garden-of-echoes",
    title: "حديقة الأصداء",
    englishTitle: "Garden of Echoes",
    cover: "/anime/478748.jpg",
    description: "كل زهرة في الحديقة تحفظ جملة لم يستطع صاحبها قولها في وقتها.",
    categories: ["رومانسي", "شريحة من الحياة"],
    categorySlugs: ["romance", "slice-of-life"],
    author: "هند عادل",
    status: "hiatus",
    type: "novel",
    publishedAt: "2025-08-20",
    updatedAt: "2026-04-01",
    addedAt: "2025-08-21",
    rating: 4.2,
    ratingCount: 73,
    chapters: makeChapters(4, "الحديقة الشرقية"),
    similarWorkIds: ["paper-moon", "city-of-amber"],
    comments: [],
  },
  {
    id: "seventh-window",
    title: "النافذة السابعة",
    englishTitle: "The Seventh Window",
    cover: "/anime/603242.jpg",
    description: "محققة شابة تلاحق سلسلة رسائل تظهر على نوافذ مبنى مهجور.",
    categories: ["إثارة", "غموض"],
    categorySlugs: ["thriller", "mystery"],
    author: "نور قاسم",
    status: "completed",
    type: "short-story",
    publishedAt: "2026-03-10",
    updatedAt: "2026-03-29",
    addedAt: "2026-03-10",
    rating: 4.1,
    ratingCount: 47,
    chapters: makeChapters(2, "المبنى السابع"),
    similarWorkIds: ["last-lighthouse"],
    comments: [],
  },
  {
    id: "clockmakers-daughter",
    title: "ابنة صانع الساعات",
    englishTitle: "The Clockmaker's Daughter",
    cover: "/anime/411246.jpg",
    banner: "/anime/463379.jpg",
    description:
      "وريثة متجر قديم تستطيع سماع اللحظات التي ضاعت من أصحاب الساعات.",
    categories: ["خيال", "دراما"],
    categorySlugs: ["fantasy", "drama"],
    author: "إياد منصور",
    status: "ongoing",
    type: "novel",
    publishedAt: "2026-05-11",
    updatedAt: "2026-09-14",
    addedAt: "2026-05-11",
    rating: 4.9,
    ratingCount: 187,
    chapters: makeChapters(5, "شارع الساعات"),
    similarWorkIds: ["city-of-amber"],
    comments: COMMENTS.slice(1),
  },
  {
    id: "archive-of-ash",
    title: "أرشيف الرماد",
    englishTitle: "Archive of Ash",
    cover: "/anime/384226.jpg",
    description: "أمين أرشيف يبحث في سجلات نجت من حريق لم ينجُ منه أحد.",
    categories: ["تاريخي", "غموض"],
    categorySlugs: ["historical", "mystery"],
    author: "ريم جبران",
    status: "archived",
    type: "novel",
    publishedAt: "2024-09-01",
    updatedAt: "2025-02-12",
    addedAt: "2024-09-01",
    rating: 4.7,
    ratingCount: 204,
    chapters: makeChapters(4, "دار السجلات"),
    similarWorkIds: ["last-lighthouse"],
    comments: [],
  },
  {
    id: "silent-orchard",
    title: "البستان الصامت",
    englishTitle: "The Silent Orchard",
    cover: "/anime/366722.jpg",
    description:
      "حكاية عن قرية تتوارث موسمًا لا يأتي، وسرّ محفوظ في بستان مهجور.",
    categories: ["دراما", "تاريخي"],
    categorySlugs: ["drama", "historical"],
    author: "آية الخطيب",
    status: "ongoing",
    type: "novel",
    publishedAt: "2026-08-30",
    updatedAt: "2026-08-30",
    addedAt: "2026-08-30",
    rating: 4,
    ratingCount: 12,
    chapters: [],
    similarWorkIds: ["garden-of-echoes"],
    comments: [],
  },
] as const;

export const getTextWorkById = (id: string): TextWork | undefined =>
  TEXT_WORKS.find((work) => work.id === id);

export const getTextChapterById = (
  work: TextWork,
  chapterId: string,
): TextChapter | undefined =>
  work.chapters.find(
    (chapter) =>
      chapter.id === chapterId ||
      String(chapter.number) === String(Number(chapterId)),
  );

export const TEXT_STATUS_LABELS: Record<TextWorkStatus, string> = {
  ongoing: "مستمرة",
  completed: "مكتملة",
  hiatus: "متوقفة مؤقتًا",
  archived: "غير متاح حاليًا",
};

export const TEXT_TYPE_LABELS: Record<TextContentType, string> = {
  novel: "رواية",
  "short-story": "قصة نصية",
};
