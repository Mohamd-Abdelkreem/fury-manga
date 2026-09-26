import {
  contentSlugSchema,
  storyStatusSchema,
  workTagSchema,
  workTypeSchema,
} from "@fury/contracts";
import { z } from "zod";

const normalizedTags = (value: string): string[] =>
  value
    .split(/[,،]/u)
    .map((tag) => tag.trim())
    .filter(Boolean)
    .map((tag) => workTagSchema.parse(tag));

export const adminWorkFormSchema = z
  .object({
    title: z.string().trim().min(1).max(200),
    slug: contentSlugSchema,
    alternativeTitle: z.string().trim().max(200),
    type: workTypeSchema,
    storyStatus: storyStatusSchema,
    synopsis: z.string().trim().max(5_000),
    author: z.string().trim().max(150),
    artist: z.string().trim().max(150),
    categoryIds: z.array(z.uuid()).max(100),
    tagsText: z.string().max(1_000),
    featuredHome: z.boolean(),
    featuredOrderText: z.string().trim().max(10),
    coverAssetId: z.uuid().nullable(),
    backgroundAssetId: z.uuid().nullable(),
  })
  .strict()
  .superRefine((values, context) => {
    if (
      values.synopsis.length > 0 &&
      (values.synopsis.length < 20 || values.synopsis.length > 5_000)
    ) {
      context.addIssue({
        code: "custom",
        message: "أدخل نبذة من 20 حرفًا على الأقل أو اتركها فارغة.",
        path: ["synopsis"],
      });
    }
    const categoryIds = values.categoryIds.map((id) => id.toLowerCase());
    if (new Set(categoryIds).size !== categoryIds.length) {
      context.addIssue({
        code: "custom",
        message: "لا يمكن تكرار التصنيف.",
        path: ["categoryIds"],
      });
    }
    let tags: string[];
    try {
      tags = normalizedTags(values.tagsText);
    } catch {
      context.addIssue({
        code: "custom",
        message: "تحقق من الوسوم؛ طول الوسم من حرف إلى 40 حرفًا.",
        path: ["tagsText"],
      });
      return;
    }
    if (tags.length > 20) {
      context.addIssue({
        code: "custom",
        message: "يمكن إضافة 20 وسمًا كحد أقصى.",
        path: ["tagsText"],
      });
    }
    if (new Set(tags).size !== tags.length) {
      context.addIssue({
        code: "custom",
        message: "أزل الوسوم المكررة.",
        path: ["tagsText"],
      });
    }
    if (values.featuredHome) {
      const featuredOrder = Number(values.featuredOrderText);
      if (
        !/^[1-9]\d*$/u.test(values.featuredOrderText) ||
        featuredOrder > 2_147_483_647
      ) {
        context.addIssue({
          code: "custom",
          message: "أدخل موضعًا موجبًا للعرض المميز.",
          path: ["featuredOrderText"],
        });
      }
    } else if (values.featuredOrderText.length > 0) {
      context.addIssue({
        code: "custom",
        message: "فعّل العرض المميز قبل تحديد موضعه.",
        path: ["featuredOrderText"],
      });
    }
  });

export type FormValues = z.infer<typeof adminWorkFormSchema>;

export const emptyWorkFormValues = (): FormValues => ({
  title: "",
  slug: "",
  alternativeTitle: "",
  type: "manga",
  storyStatus: "ongoing",
  synopsis: "",
  author: "",
  artist: "",
  categoryIds: [],
  tagsText: "",
  featuredHome: false,
  featuredOrderText: "",
  coverAssetId: null,
  backgroundAssetId: null,
});

export const tagsFromForm = normalizedTags;
