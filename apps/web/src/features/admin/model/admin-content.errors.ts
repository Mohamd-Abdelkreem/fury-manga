import { SafeAdminContentError } from "../api/admin-content.api";

export const isAmbiguousAdminCreateResult = (error: unknown): boolean =>
  error instanceof SafeAdminContentError &&
  error.code !== "CANCELLED" &&
  error.code !== "ACCESS_FENCED" &&
  (error.statusCode === 0 || error.statusCode >= 500);

export const isMissingAdminCreateReadback = (error: unknown): boolean =>
  error instanceof SafeAdminContentError && error.code === "NOT_FOUND";

export type CategoryFieldErrors = Readonly<{
  name?: string;
  slug?: string;
}>;

export type WorkFieldErrors = Readonly<{
  title?: string;
  slug?: string;
  alternativeTitle?: string;
  synopsis?: string;
  author?: string;
  artist?: string;
  categoryIds?: string;
  tagsText?: string;
  featuredOrderText?: string;
}>;

// A rejected unsafe request may be CSRF, not revocation of GET authority.
export const isWriteSideAdminForbidden = (error: unknown): boolean =>
  error instanceof SafeAdminContentError &&
  error.statusCode === 403 &&
  error.code === "FORBIDDEN";

export const isTerminalAdminContentError = (
  error: unknown,
): error is SafeAdminContentError =>
  error instanceof SafeAdminContentError &&
  (error.statusCode === 401 ||
    error.statusCode === 403 ||
    error.code === "UNAUTHORIZED" ||
    error.code === "FORBIDDEN");

export const adminContentErrorMessage = (error: unknown): string => {
  if (!(error instanceof SafeAdminContentError)) {
    return "تعذر إكمال طلب التصنيف. حاول مرة أخرى.";
  }

  switch (error.code) {
    case "CONTENT_CATEGORY_IN_USE":
      return "لا يمكن تعطيل التصنيف لأنه التصنيف المفعّل الأخير لعمل منشور.";
    case "CONTENT_CONFLICT":
    case "CONFLICT":
      return "يوجد تصنيف آخر يستخدم الرابط المختصر نفسه.";
    case "CONTENT_IMMUTABLE":
      return "لا يمكن تغيير الرابط المختصر بعد إنشاء التصنيف.";
    case "CONTENT_STALE_WRITE":
      return "تغيّرت بيانات التصنيف. أعد تحميلها قبل المحاولة مجددًا.";
    case "VALIDATION_ERROR":
    case "BAD_REQUEST":
      return "راجع بيانات التصنيف والموضع المحدد ثم حاول مرة أخرى.";
    case "UNAUTHORIZED":
      return "انتهت صلاحية الجلسة. سجّل الدخول مجددًا.";
    case "FORBIDDEN":
      return "ليس لديك صلاحية لإدارة التصنيفات.";
    case "NOT_FOUND":
      return "لم يعد التصنيف موجودًا. حدّث القائمة.";
    case "RATE_LIMIT_EXCEEDED":
      return "طلبات كثيرة خلال وقت قصير. انتظر قليلًا ثم حاول مجددًا.";
    case "NETWORK_ERROR":
      return "تعذر الاتصال بالخدمة. تحقق من الاتصال ثم أعد المحاولة.";
    case "CANCELLED":
    case "ACCESS_FENCED":
      return "لم يتم تحديث التصنيفات. تحقق من الصلاحية وحاول مجددًا.";
    case "SERVICE_UNAVAILABLE":
    case "INTERNAL_SERVER_ERROR":
      return "الخدمة غير متاحة مؤقتًا. احتفظ بتعديلاتك وحاول مجددًا.";
    default:
      return "تعذر إكمال طلب التصنيف. حاول مرة أخرى.";
  }
};

export const categoryFieldErrors = (error: unknown): CategoryFieldErrors => {
  if (
    !(error instanceof SafeAdminContentError) ||
    error.code !== "VALIDATION_ERROR"
  ) {
    return {};
  }

  const fields: CategoryFieldErrors = {
    ...(error.fieldPaths.includes("body.displayName")
      ? { name: "راجع اسم التصنيف المدخل." }
      : {}),
    ...(error.fieldPaths.includes("body.slug")
      ? { slug: "استخدم أحرفًا إنجليزية صغيرة وأرقامًا وشرطات فقط." }
      : {}),
  };
  return fields;
};

export const adminWorkErrorMessage = (error: unknown): string => {
  if (!(error instanceof SafeAdminContentError)) {
    return "تعذر حفظ مسودة العمل. احتفظ بتعديلاتك وحاول مجددًا.";
  }
  switch (error.code) {
    case "CONTENT_CONFLICT":
      return "تعارضت بيانات العمل أو الوسائط. راجع اختياراتك ثم حاول مجددًا.";
    case "CONTENT_IMMUTABLE":
      return "لا يمكن تغيير الرابط المختصر أو نوع العمل بعد إنشائه.";
    case "CONTENT_STALE_WRITE":
      return "حُدّث العمل في مكان آخر. قارن النسخة المحفوظة بتعديلاتك.";
    case "VALIDATION_ERROR":
    case "BAD_REQUEST":
      return "راجع الحقول المحددة ثم حاول حفظ المسودة مجددًا.";
    case "NOT_FOUND":
      return "لم يعد العمل أو أحد التصنيفات أو الوسائط متاحًا.";
    case "UNAUTHORIZED":
      return "انتهت صلاحية الجلسة. سجّل الدخول مجددًا.";
    case "FORBIDDEN":
      return "ليس لديك صلاحية إدارة مسودات الأعمال.";
    case "NETWORK_ERROR":
      return "تعذر تأكيد نتيجة الحفظ. تحقق من العمل قبل إعادة المحاولة.";
    case "CANCELLED":
    case "ACCESS_FENCED":
      return "لم يتم تأكيد الحفظ. تحقق من الصلاحية واحتفظ بتعديلاتك.";
    case "RATE_LIMIT_EXCEEDED":
      return "طلبات كثيرة خلال وقت قصير. احتفظ بتعديلاتك وحاول لاحقًا.";
    case "SERVICE_UNAVAILABLE":
    case "INTERNAL_SERVER_ERROR":
    case "HTTP_ERROR":
      return "الخدمة غير متاحة مؤقتًا. احتفظ بتعديلاتك وحاول مجددًا.";
    default:
      return "تعذر حفظ مسودة العمل. احتفظ بتعديلاتك وحاول مجددًا.";
  }
};

export const workFieldErrors = (error: unknown): WorkFieldErrors => {
  if (
    !(error instanceof SafeAdminContentError) ||
    error.code !== "VALIDATION_ERROR"
  ) {
    return {};
  }
  const paths = new Set(error.fieldPaths);
  const hasTagError = [...paths].some((path) =>
    /^body\.tags(?:\.\d+)?$/u.test(path),
  );
  const hasCategoryError = [...paths].some((path) =>
    /^body\.categoryIds(?:\.\d+)?$/u.test(path),
  );
  return {
    ...(paths.has("body.title") ? { title: "راجع عنوان العمل." } : {}),
    ...(paths.has("body.slug")
      ? { slug: "استخدم رابطًا صغير الأحرف والشرطات فقط." }
      : {}),
    ...(paths.has("body.alternativeTitle")
      ? { alternativeTitle: "راجع العنوان البديل." }
      : {}),
    ...(paths.has("body.synopsis") ? { synopsis: "راجع طول النبذة." } : {}),
    ...(paths.has("body.author") ? { author: "راجع اسم المؤلف." } : {}),
    ...(paths.has("body.artist") ? { artist: "راجع اسم الرسام." } : {}),
    ...(hasCategoryError ? { categoryIds: "راجع التصنيفات المختارة." } : {}),
    ...(hasTagError ? { tagsText: "راجع الوسوم المكررة أو حدودها." } : {}),
    ...(paths.has("body.featuredOrder")
      ? { featuredOrderText: "راجع موضع العرض المميز." }
      : {}),
  };
};
