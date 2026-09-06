import type { SafeUser } from "@fury/contracts";

export type AuthenticatedUser = SafeUser;

export interface ValidatedRequestData {
  body?: unknown;
  params?: unknown;
  query?: unknown;
}
