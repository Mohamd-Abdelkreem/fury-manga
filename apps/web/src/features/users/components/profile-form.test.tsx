import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ProfileForm } from "./profile-form";

const mocks = vi.hoisted(() => ({ mutateAsync: vi.fn() }));

vi.mock("@/features/auth/hooks/auth.hooks", () => ({
  useSession: () => ({
    data: {
      user: {
        fullName: "سلمى القارئة",
        email: "salma@example.com",
        phone: "+201000000000",
      },
    },
  }),
}));
vi.mock("@/features/users/hooks/users.hooks", () => ({
  useUpdateProfile: () => ({ mutateAsync: mocks.mutateAsync }),
}));

describe("ProfileForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.mutateAsync.mockResolvedValue({});
  });

  it("updates the display name through the existing account mutation without exposing phone editing", async () => {
    render(<ProfileForm />);

    expect(screen.queryByLabelText(/الهاتف|Phone/i)).not.toBeInTheDocument();
    expect(screen.getByLabelText("البريد الإلكتروني")).toBeDisabled();

    fireEvent.change(screen.getByLabelText("اسم العرض"), {
      target: { value: "سلمى الجديدة" },
    });
    fireEvent.click(screen.getByRole("button", { name: "حفظ اسم العرض" }));

    await waitFor(() => {
      expect(mocks.mutateAsync).toHaveBeenCalledWith({
        fullName: "سلمى الجديدة",
      });
    });
    expect(screen.getByRole("status")).toHaveTextContent("تم حفظ اسم العرض");
  });
});
