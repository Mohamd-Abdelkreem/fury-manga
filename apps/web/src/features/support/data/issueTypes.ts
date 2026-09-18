export const ISSUE_TYPES = [
  { value: "broken-image", label: "صورة فصل معطلة" },
  { value: "text-formatting", label: "مشكلة في تنسيق النص" },
  { value: "incorrect-work", label: "معلومات عمل غير صحيحة" },
  { value: "community", label: "تعليق أو مشكلة مجتمعية" },
  { value: "account", label: "مشكلة في الحساب" },
  { value: "advertisement", label: "مشكلة في إعلان" },
  { value: "other", label: "أخرى" },
] as const;

export type IssueType = (typeof ISSUE_TYPES)[number]["value"];
