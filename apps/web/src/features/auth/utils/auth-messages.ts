const messages: Readonly<Record<string, string>> = {
  "Invalid credentials.": "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
  "Email is already in use.": "البريد الإلكتروني مستخدم بالفعل.",
  "Email not recognized.": "البريد الإلكتروني غير معروف.",
  "Verify your email before signing in.":
    "أكّد بريدك الإلكتروني قبل تسجيل الدخول.",
  "Account is suspended.": "تم إيقاف هذا الحساب.",
  "Password confirmation does not match.": "تأكيد كلمة المرور غير مطابق.",
  "Invalid or expired reset token.":
    "رابط استعادة كلمة المرور غير صالح أو منتهي الصلاحية.",
  "Invalid or expired verification token.":
    "رابط تأكيد البريد الإلكتروني غير صالح أو منتهي الصلاحية.",
  "Invalid email address": "أدخل بريدًا إلكترونيًا صالحًا.",
  "Review the fields.": "راجع البيانات المدخلة وحاول مرة أخرى.",
  "Some submitted values are invalid.": "بعض البيانات المدخلة غير صالحة.",
  "The request contains invalid data. Review it and try again.":
    "راجع البيانات المدخلة وحاول مرة أخرى.",
  "Unable to reach the server. Check your connection and try again.":
    "تعذّر الاتصال بالخادم. تحقّق من اتصالك بالإنترنت وحاول مرة أخرى.",
  "The request timed out. Try again.": "انتهت مهلة الطلب. حاول مرة أخرى.",
  "Too many requests. Wait a moment and try again.":
    "محاولات كثيرة. انتظر قليلًا ثم حاول مرة أخرى.",
  "Your session has expired. Sign in again to continue.":
    "انتهت جلستك. سجّل الدخول مرة أخرى للمتابعة.",
  "You do not have permission to perform this action.":
    "ليس لديك صلاحية لتنفيذ هذا الإجراء.",
  "The service is temporarily unavailable.":
    "الخدمة غير متاحة مؤقتًا. حاول مرة أخرى لاحقًا.",
};

export function localizeAuthMessage(
  message: string | null | undefined,
): string | undefined {
  if (message == null) return undefined;
  if (messages[message] !== undefined) return messages[message];
  if (/\p{Script=Arabic}/u.test(message)) return message;
  const minimum = /Too small: expected string to have >=(\d+) characters/u.exec(
    message,
  );
  if (minimum !== null && minimum[1] !== undefined)
    return minimum[1] === "1"
      ? "هذا الحقل مطلوب."
      : `استخدم ${minimum[1]} حرفًا على الأقل.`;
  const maximum = /Too big: expected string to have <=(\d+) characters/u.exec(
    message,
  );
  if (maximum !== null && maximum[1] !== undefined)
    return `يجب ألا يتجاوز هذا الحقل ${maximum[1]} حرفًا.`;
  return "تعذّر إتمام الطلب. راجع البيانات وحاول مرة أخرى.";
}
