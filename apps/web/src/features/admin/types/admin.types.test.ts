import { describe, expectTypeOf, it } from "vitest";

import type { UserRole, WorkType } from "@fury/contracts";

import type { AdminUserRole, AdminWorkType } from "./admin.types";

describe("admin contract type boundary", () => {
  it("derives canonical Work and lowercase role values from shared contracts", () => {
    expectTypeOf<AdminWorkType>().toEqualTypeOf<WorkType>();
    expectTypeOf<AdminUserRole>().toEqualTypeOf<Lowercase<UserRole>>();
  });
});
