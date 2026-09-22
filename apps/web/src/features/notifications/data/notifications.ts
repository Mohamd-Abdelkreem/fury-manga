export type NotificationFixture = Readonly<{
  id: number;
  type: "gift-granted" | "bookmarked-work-chapter";
  text: string;
  time: string;
  unread: boolean;
  href: string;
}>;

export const NOTIFICATION_FIXTURES: readonly NotificationFixture[] = [
  {
    id: 1,
    type: "bookmarked-work-chapter",
    text: "صدر فصل جديد من عمل محفوظ لديك.",
    time: "قبل 3 دقائق",
    unread: true,
    href: "/story/trait-hoarder/chapter/43",
  },
  {
    id: 2,
    type: "gift-granted",
    text: "لديك إطارات وزخارف جاهزة للمعاينة.",
    time: "قبل ساعتين",
    unread: true,
    href: "/settings#avatar-frame",
  },
] as const;
