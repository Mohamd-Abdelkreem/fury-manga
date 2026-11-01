import { fireEvent, render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type { AuthUserData } from "@fury/contracts";

import { AUTH_SESSION_QUERY_KEY } from "@/features/auth/hooks/auth.hooks";
import { ProfileForm } from "@/features/users/components/profile-form";
import {
  apiClient,
  clearAccessToken,
  getAccessToken,
  setAccessToken,
} from "@/services/api/api-client";

import { PasswordForm } from "./password-form";
import { SessionControls } from "./session-controls";

const originalAdapter = apiClient.defaults.adapter;
const clients: QueryClient[] = [];
const account: AuthUserData = {
  user: {
    id: "1b3d904e-a46c-4dd8-9cb7-d0767546ea95",
    fullName: "قارئ محفوظ",
    email: "reader@example.test",
    role: "USER",
    status: "ACTIVE",
    emailVerifiedAt: "2026-11-01T00:00:00.000Z",
    createdAt: "2026-11-01T00:00:00.000Z",
    updatedAt: "2026-11-01T00:00:00.000Z",
  },
};
const passwordFields = [
  ["كلمة المرور الحالية", "ExistingAccountPassword!123"],
  ["كلمة المرور الجديدة", "ReplacementAccountPassword!456"],
  ["تأكيد كلمة المرور الجديدة", "ReplacementAccountPassword!456"],
] as const;
const renderAccountForm = (Component: typeof ProfileForm) => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  clients.push(client);
  client.setQueryData(AUTH_SESSION_QUERY_KEY, account);
  return render(
    <QueryClientProvider client={client}>
      <Component />
    </QueryClientProvider>,
  );
};

beforeEach(() => {
  setAccessToken("account-feedback-test-session");
});
afterEach(() => {
  if (originalAdapter === undefined) delete apiClient.defaults.adapter;
  else apiClient.defaults.adapter = originalAdapter;
  clearAccessToken();
  for (const client of clients.splice(0)) client.clear();
});

describe("account feedback through the actual hooks and transport", () => {
  it.each([
    {
      Component: ProfileForm,
      fields: [["اسم العرض", "اسم محلي محفوظ"]] as const,
      button: "حفظ اسم العرض",
      role: "status",
    },
    {
      Component: PasswordForm,
      fields: passwordFields,
      button: "تغيير كلمة المرور",
      role: "alert",
    },
    {
      Component: SessionControls,
      fields: [] as const,
      button: "تسجيل خروج هذه الجلسة",
      role: "alert",
    },
    {
      Component: SessionControls,
      fields: [] as const,
      button: "تسجيل الخروج من كل الأجهزة",
      role: "alert",
    },
  ])(
    "localizes an unacknowledged $button failure",
    async ({ Component, fields, button, role }) => {
      apiClient.defaults.adapter = (config) =>
        Promise.reject(new AxiosError("Network Error", "ERR_NETWORK", config));
      renderAccountForm(Component);
      for (const [label, entered] of fields) {
        fireEvent.change(screen.getByLabelText(new RegExp(`^${label}`)), {
          target: { value: entered },
        });
      }

      fireEvent.click(screen.getByRole("button", { name: button }));

      expect(await screen.findByRole(role)).toHaveTextContent(
        "تعذّر الاتصال بالخادم. تحقّق من اتصالك بالإنترنت وحاول مرة أخرى.",
      );
      expect(getAccessToken().kind).toBe("value");
      expect(
        screen.queryByText("تم حفظ اسم العرض في حسابك."),
      ).not.toBeInTheDocument();
    },
  );

  it.each([
    {
      status: 400,
      code: "BAD_REQUEST",
      message: "Current password is not correct.",
      expected: "كلمة المرور الحالية غير صحيحة.",
    },
    {
      status: 429,
      code: "RATE_LIMIT_EXCEEDED",
      message: "Too many requests. Please try again later.",
      expected: "محاولات كثيرة. انتظر قليلًا ثم حاول مرة أخرى.",
    },
  ])(
    "localizes the $status response without replacing the draft",
    async ({ status, code, message, expected }) => {
      apiClient.defaults.adapter = (config) =>
        Promise.reject(
          new AxiosError("Bad Request", "ERR_BAD_REQUEST", config, undefined, {
            config,
            status,
            statusText: "Rejected",
            headers: {},
            data: {
              success: false,
              statusCode: status,
              code,
              message,
              errors: [],
              requestId: "account-feedback-test",
            },
          }),
        );
      renderAccountForm(PasswordForm);
      for (const [label, entered] of passwordFields) {
        fireEvent.change(screen.getByLabelText(new RegExp(`^${label}`)), {
          target: { value: entered },
        });
      }

      fireEvent.click(
        screen.getByRole("button", { name: "تغيير كلمة المرور" }),
      );

      expect(await screen.findByRole("alert")).toHaveTextContent(expected);
      expect(screen.getByLabelText("كلمة المرور الحالية")).toHaveValue(
        passwordFields[0][1],
      );
    },
  );
});
