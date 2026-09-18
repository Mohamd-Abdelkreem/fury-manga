export type GiftAvailability = "granted" | "revoked" | "disabled";

export type AvatarFrameGift = Readonly<{
  id: string;
  name: string;
  description: string;
  availability: GiftAvailability;
  accent: string;
  ring: string;
}>;

export type CommentDecorationGift = Readonly<{
  id: string;
  name: string;
  description: string;
  availability: GiftAvailability;
  tone: "ember" | "gold" | "midnight";
}>;

export const AVATAR_FRAMES: readonly AvatarFrameGift[] = [
  {
    id: "ember-ring",
    name: "حلقة اللهب",
    description: "إطار مرجاني هادئ يترك الصورة واضحة.",
    availability: "granted",
    accent: "#ff6868",
    ring: "rgba(255, 71, 71, 0.24)",
  },
  {
    id: "night-reader",
    name: "قارئ الليل",
    description: "إطار داكن بلمسة فضية خافتة.",
    availability: "granted",
    accent: "#d8d8d8",
    ring: "rgba(255, 255, 255, 0.14)",
  },
  {
    id: "founder-mark",
    name: "شارة المؤسس",
    description: "هدية سابقة لم تعد متاحة للاستخدام.",
    availability: "revoked",
    accent: "#ffb300",
    ring: "rgba(255, 179, 0, 0.18)",
  },
] as const;

export const COMMENT_DECORATIONS: readonly CommentDecorationGift[] = [
  {
    id: "ember-note",
    name: "هامش الجمر",
    description: "حافة مرجانية رفيعة مع خلفية Fury الداكنة.",
    availability: "granted",
    tone: "ember",
  },
  {
    id: "golden-chapter",
    name: "الفصل الذهبي",
    description: "تفصيل ذهبي محدود للتمييز من دون إضعاف القراءة.",
    availability: "granted",
    tone: "gold",
  },
  {
    id: "old-ink",
    name: "حبر الأرشيف",
    description: "زخرفة موقوفة لا يمكن اختيارها حاليًا.",
    availability: "disabled",
    tone: "midnight",
  },
] as const;

export const DEFAULT_AVATAR_FRAME_ID = "ember-ring";
export const DEFAULT_COMMENT_DECORATION_ID = "ember-note";
