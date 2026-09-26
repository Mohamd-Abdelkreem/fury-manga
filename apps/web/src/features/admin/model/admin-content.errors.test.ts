import { describe, expect, it } from "vitest";

import { SafeAdminContentError } from "../api/admin-content.api";
import { adminWorkErrorMessage, workFieldErrors } from "./admin-content.errors";

describe("administrator Work safe errors", () => {
  it("maps allowlisted indexed validation paths to Arabic editor fields", () => {
    const error = new SafeAdminContentError("VALIDATION_ERROR", 400, "req-1", [
      "body.tags.2",
      "body.categoryIds.0",
      "body.author",
      "body.untrusted.secret",
    ]);

    expect(workFieldErrors(error)).toEqual({
      author: "راجع اسم المؤلف.",
      categoryIds: "راجع التصنيفات المختارة.",
      tagsText: "راجع الوسوم المكررة أو حدودها.",
    });
  });

  it("keeps server details and request identifiers out of user-facing messages", () => {
    const error = new SafeAdminContentError("NETWORK_ERROR", 0, "private-id");
    const message = adminWorkErrorMessage(error);

    expect(message).toMatch(/تعذر تأكيد نتيجة الحفظ/u);
    expect(message).not.toContain("private-id");
    expect(message).not.toContain(error.message);
  });
});
