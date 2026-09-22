import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { RegisterForm } from "./register-form";

vi.mock("@/features/auth/hooks/auth.hooks", () => ({
  useRegister: () => ({ mutateAsync: vi.fn() }),
}));

describe("RegisterForm", () => {
  it("keeps contract compatibility without exposing a phone field", () => {
    render(<RegisterForm />);
    expect(screen.getByLabelText("الاسم الكامل")).toBeInTheDocument();
    expect(screen.queryByLabelText(/الهاتف|Phone/i)).not.toBeInTheDocument();
  });
});
