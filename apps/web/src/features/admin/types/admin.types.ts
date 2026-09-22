import type { TextBlock } from "../../text-stories/data/textStories";

export type AdminWorkType =
  | "manga"
  | "manhwa"
  | "manhua"
  | "comics"
  | "novel"
  | "text-story";

export type AdminStoryStatus =
  | "ongoing"
  | "completed"
  | "hiatus"
  | "cancelled";

export type AdminPublishStatus = "draft" | "published" | "archived";

export type AdminContentType = "illustrated" | "text";

export interface AdminChapter {
  id: string;
  workId: string;
  number: number;
  title: string;
  contentType: AdminContentType;
  status: AdminPublishStatus;
  publishedAt: string;
  updatedAt: string;
  views: number;
  pages?: string[] | undefined;
  textContent?: string | undefined;
  textBlocks?: TextBlock[] | undefined;
}

export interface AdminWork {
  id: string;
  title: string;
  alternativeTitle?: string | undefined;
  type: AdminWorkType;
  storyStatus: AdminStoryStatus;
  publishStatus: AdminPublishStatus;
  description: string;
  author: string;
  artist?: string | undefined;
  genres: string[];
  tags: string[];
  coverImage: string;
  bannerImage?: string | undefined;
  chapterCount: number;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdminDashboardMetrics {
  publishedWorks: number;
  draftWorks: number;
  publishedChapters: number;
  activeUsers: number;
  openReports: number;
  unreadMessages: number;
}

export interface AdminActivityEvent {
  id: string;
  type:
    | "work_created"
    | "chapter_published"
    | "report_opened"
    | "work_updated"
    | "user_registered";
  title: string;
  description: string;
  timestamp: string;
  actor: string;
}

export interface AdminUserSummary {
  name: string;
  email: string;
  role: string;
  avatarUrl?: string | undefined;
}

export const ADMIN_WORK_TYPE_LABELS: Record<AdminWorkType, string> = {
  manga: "مانغا",
  manhwa: "مانهوا",
  manhua: "مانهوا صينية",
  comics: "كوميكس",
  novel: "رواية",
  "text-story": "قصة نصية",
};

export const ADMIN_STORY_STATUS_LABELS: Record<AdminStoryStatus, string> = {
  ongoing: "مستمرة",
  completed: "مكتملة",
  hiatus: "متوقفة مؤقتًا",
  cancelled: "ملغاة",
};

export const ADMIN_PUBLISH_STATUS_LABELS: Record<AdminPublishStatus, string> = {
  published: "منشور",
  draft: "مسودة",
  archived: "مؤرشف",
};

export const ADMIN_CONTENT_TYPE_LABELS: Record<AdminContentType, string> = {
  illustrated: "مصور",
  text: "نصي",
};

export const AVAILABLE_GENRES: readonly string[] = [
  "أكشن",
  "مغامرات",
  "فنتازيا",
  "خيال علمي",
  "غموض",
  "سحر",
  "قتال",
  "شريحة من الحياة",
  "دراما",
  "رعب",
  "كوميديا",
  "رومانسي",
  "تاريخي",
  "ألعاب",
  "عوالم أخرى",
];

export type AdminUserRole = "user" | "moderator" | "admin";
export type AdminUserStatus = "active" | "suspended";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminUserRole;
  status: AdminUserStatus;
  points: number;
  avatarUrl?: string | undefined;
  joinedAt: string;
  lastActiveAt: string;
  giftsCount: number;
}

export interface AdminUserReadingProgress {
  workId: string;
  workTitle: string;
  lastChapterNumber: number;
  lastChapterTitle: string;
  lastReadAt: string;
}

export interface AdminUserBookmark {
  workId: string;
  workTitle: string;
  coverImage: string;
  totalChapters: number;
  addedAt: string;
}

export interface AdminUserOwnedGift {
  grantId: string;
  giftId: string;
  giftName: string;
  giftType: AdminGiftType;
  grantedAt: string;
  grantedBy: string;
  reason: string;
}

export interface AdminModerationNote {
  id: string;
  author: string;
  content: string;
  createdAt: string;
}

export interface AdminUserDetail extends AdminUser {
  readingProgress: AdminUserReadingProgress[];
  bookmarks: AdminUserBookmark[];
  ownedGifts: AdminUserOwnedGift[];
  moderationNotes: AdminModerationNote[];
}

export type AdminGiftType = "avatar_frame" | "comment_decoration";
export type AdminGiftStatus = "active" | "disabled" | "archived";

export interface AdminGiftDesign {
  id: string;
  name: string;
  description: string;
  type: AdminGiftType;
  status: AdminGiftStatus;
  accentColor: string;
  ringColor?: string | undefined;
  tone?: "ember" | "gold" | "midnight" | undefined;
  createdAt: string;
  recipientCount: number;
}

export interface AdminGiftGrantRecord {
  id: string;
  giftId: string;
  giftName: string;
  giftType: AdminGiftType;
  userId: string;
  userName: string;
  userEmail: string;
  grantedBy: string;
  grantedAt: string;
  reason: string;
  notificationTitle: string;
  notificationBody: string;
}

export const ADMIN_USER_ROLE_LABELS: Record<AdminUserRole, string> = {
  admin: "مدير",
  moderator: "مشرف",
  user: "مستخدم",
};

export const ADMIN_USER_STATUS_LABELS: Record<AdminUserStatus, string> = {
  active: "نشط",
  suspended: "موقوف",
};

export const ADMIN_GIFT_TYPE_LABELS: Record<AdminGiftType, string> = {
  avatar_frame: "إطار صورة شخصية",
  comment_decoration: "زخرفة تعليق",
};

export const ADMIN_GIFT_STATUS_LABELS: Record<AdminGiftStatus, string> = {
  active: "نشط",
  disabled: "معطل",
  archived: "مؤرشف",
};

// --- Comments Moderation Types ---
export type AdminCommentStatus = "visible" | "hidden";

export interface AdminComment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string | undefined;
  workId: string;
  workTitle: string;
  chapterId?: string | undefined;
  chapterNumber?: number | undefined;
  chapterTitle?: string | undefined;
  content: string;
  createdAt: string;
  status: AdminCommentStatus;
  hiddenReason?: string | undefined;
  reportCount: number;
  likesCount: number;
}

export const ADMIN_COMMENT_STATUS_LABELS: Record<AdminCommentStatus, string> = {
  visible: "ظاهر للقراء",
  hidden: "مخفي من الإدارة",
};

// --- Reports Moderation Types ---
export type AdminReportReason =
  | "abuse"
  | "inappropriate"
  | "spoiler"
  | "spam"
  | "other";

export type AdminReportStatus =
  | "open"
  | "under_review"
  | "resolved"
  | "dismissed";

export type AdminReportResolution =
  | "comment_hidden"
  | "no_violation"
  | "duplicate"
  | "user_reviewed";

export interface AdminReport {
  id: string;
  commentId: string;
  reason: AdminReportReason;
  description?: string | undefined;
  reporterId: string;
  reporterName: string;
  reportedUserId: string;
  reportedUserName: string;
  commentSnippet: string;
  workId: string;
  workTitle: string;
  chapterId?: string | undefined;
  chapterNumber?: number | undefined;
  createdAt: string;
  status: AdminReportStatus;
  resolutionOutcome?: AdminReportResolution | undefined;
  resolutionNote?: string | undefined;
  resolvedAt?: string | undefined;
  resolvedBy?: string | undefined;
}

export const ADMIN_REPORT_REASON_LABELS: Record<AdminReportReason, string> = {
  abuse: "إساءة أو مضايقة",
  inappropriate: "محتوى غير لائق",
  spoiler: "حرق أحداث غير معلّم",
  spam: "رسائل غير مرغوبة أو إعلانات (سبام)",
  other: "أخرى",
};

export const ADMIN_REPORT_STATUS_LABELS: Record<AdminReportStatus, string> = {
  open: "مفتوح",
  under_review: "قيد المراجعة",
  resolved: "تم الحل",
  dismissed: "مرفوض / تم التجاهل",
};

export const ADMIN_REPORT_RESOLUTION_LABELS: Record<
  AdminReportResolution,
  string
> = {
  comment_hidden: "تم إخفاء التعليق المخالف",
  no_violation: "لا توجد مخالفة لمعايير النشر",
  duplicate: "بلاغ مكرر وتم دمجه",
  user_reviewed: "يتطلب مراجعة منفصلة لحساب المستخدم",
};

// --- Contact Inbox Types ---
export type AdminContactStatus = "unread" | "open" | "resolved" | "archived";
export type AdminContactSenderType = "visitor" | "registered";

export interface AdminContactMessage {
  id: string;
  name: string;
  email: string;
  senderType: AdminContactSenderType;
  userId?: string | undefined;
  subject: string;
  category?: string | undefined;
  message: string;
  status: AdminContactStatus;
  isRead: boolean;
  createdAt: string;
  internalNote?: string | undefined;
}

export const ADMIN_CONTACT_STATUS_LABELS: Record<AdminContactStatus, string> = {
  unread: "غير مقروءة",
  open: "مفتوحة",
  resolved: "مكتملة",
  archived: "مؤرشفة",
};

export const ADMIN_CONTACT_SENDER_LABELS: Record<
  AdminContactSenderType,
  string
> = {
  visitor: "زائر",
  registered: "عضو مسجل",
};

// --- Advertisement Settings Types ---
export type AdminAdPlacementType =
  | "home_banner_primary"
  | "home_banner_secondary"
  | "chapter_threshold_popunder";

export interface AdminAdPlacement {
  id: string;
  name: string;
  type: AdminAdPlacementType;
  enabled: boolean;
  provider: "Adsterra";
  zoneId: string;
  dimensions?: string | undefined;
  codeSnippet: string;
  updatedAt: string;
  implementationNote?: string | undefined;
}

export const ADMIN_AD_PLACEMENT_LABELS: Record<AdminAdPlacementType, string> = {
  home_banner_primary: "إعلان البانر الرئيسي — الصفحة الرئيسية",
  home_banner_secondary: "إعلان البانر الثانوي — الصفحة الرئيسية",
  chapter_threshold_popunder: "إعلان البوب أندر لنقاط الفصول",
};


