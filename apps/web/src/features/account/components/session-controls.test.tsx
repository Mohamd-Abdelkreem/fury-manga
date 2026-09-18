import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { SessionControls } from "./session-controls";

const mocks = vi.hoisted(() => ({
  getApiError: vi.fn(),
  logoutAllPending: false,
  logoutAllMutate: vi.fn(),
  logoutPending: false,
  logoutMutate: vi.fn(),
  replaceWithLogin: vi.fn(),
}));

vi.mock("@/features/auth/hooks/auth.hooks", () => ({
  useLogout: () => ({
    isPending: mocks.logoutPending,
    mutate: mocks.logoutMutate,
  }),
  useLogoutAll: () => ({
    isPending: mocks.logoutAllPending,
    mutate: mocks.logoutAllMutate,
  }),
}));
vi.mock("@/features/auth/utils/session-navigation", () => ({
  replaceWithLogin: mocks.replaceWithLogin,
}));
vi.mock("@/services/api/api-client", () => ({
  getApiError: mocks.getApiError,
}));

describe("SessionControls", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getApiError.mockReturnValue({ message: "Logout failed." });
    mocks.logoutPending = false;
    mocks.logoutAllPending = false;
  });

  it("replaces the page with login only after server logout-all succeeds", () => {
    render(<SessionControls />);

    fireEvent.click(
      screen.getByRole("button", { name: "تسجيل الخروج من كل الأجهزة" }),
    );
    const options = mocks.logoutAllMutate.mock.calls[0]?.[1] as
      | { onError?: (error: unknown) => void; onSuccess?: () => void }
      | undefined;
    act(() => {
      options?.onSuccess?.();
    });
    expect(mocks.replaceWithLogin).toHaveBeenCalledOnce();
  });

  it("shows an actionable failure without navigating and permits retry", () => {
    render(<SessionControls />);

    fireEvent.click(
      screen.getByRole("button", { name: "تسجيل الخروج من كل الأجهزة" }),
    );
    const options = mocks.logoutAllMutate.mock.calls[0]?.[1] as
      | { onError?: (error: unknown) => void; onSuccess?: () => void }
      | undefined;
    act(() => {
      options?.onError?.(new Error("network"));
    });

    expect(screen.getByRole("alert")).toHaveTextContent(
      "لم نتمكن من تأكيد إنهاء الجلسات على أجهزتك الأخرى",
    );
    expect(mocks.replaceWithLogin).not.toHaveBeenCalled();

    fireEvent.click(
      screen.getByRole("button", { name: "تسجيل الخروج من كل الأجهزة" }),
    );

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(mocks.logoutAllMutate).toHaveBeenCalledTimes(2);
  });

  it("derives the disabled loading state from the mutation", () => {
    mocks.logoutAllPending = true;
    render(<SessionControls />);

    expect(
      screen.getByRole("button", { name: "جارٍ إنهاء الجلسات…" }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "تسجيل خروج هذه الجلسة" }),
    ).toBeDisabled();
  });

  it("keeps the current-session server action mounted and navigates only after success", () => {
    render(<SessionControls />);
    fireEvent.click(
      screen.getByRole("button", { name: "تسجيل خروج هذه الجلسة" }),
    );
    const options = mocks.logoutMutate.mock.calls[0]?.[1] as
      { onSuccess?: () => void } | undefined;
    expect(mocks.replaceWithLogin).not.toHaveBeenCalled();
    act(() => options?.onSuccess?.());
    expect(mocks.replaceWithLogin).toHaveBeenCalledOnce();
  });
});
