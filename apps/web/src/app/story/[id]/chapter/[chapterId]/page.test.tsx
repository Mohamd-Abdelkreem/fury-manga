import { render, screen, waitFor } from "@testing-library/react";
import type { AuthUserData } from "@fury/contracts";
import { beforeEach, describe, expect, it, vi } from "vitest";

import ChapterReadingPage from "./page";

const mocks = vi.hoisted(() => ({
  replace: vi.fn(),
  useSession: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useParams: () => ({ id: "city-of-amber", chapterId: "1" }),
  usePathname: () => "/story/city-of-amber/chapter/1",
  useRouter: () => ({ replace: mocks.replace, push: vi.fn() }),
}));
vi.mock("@/features/auth/hooks/auth.hooks", () => ({
  useSession: mocks.useSession,
}));
vi.mock("@/features/home/components/Navbar/Navbar", () => ({
  Navbar: () => <div>Navigation</div>,
}));
vi.mock("@/features/home/components/Footer/Footer", () => ({
  Footer: () => <div>Footer</div>,
}));
vi.mock(
  "@/features/text-stories/components/TextChapterReader/TextChapterReader",
  () => ({
    TextChapterReader: () => <article>Fixture chapter content</article>,
  }),
);

const account: AuthUserData = {
  user: {
    id: "1b3d904e-a46c-4dd8-9cb7-d0767546ea95",
    fullName: "Reader",
    email: "reader@example.com",
    role: "USER",
    status: "ACTIVE",
    emailVerifiedAt: "2026-08-18T00:00:00.000Z",
    createdAt: "2026-08-18T00:00:00.000Z",
    updatedAt: "2026-08-18T00:00:00.000Z",
  },
};

describe("fixture chapter route", () => {
  beforeEach(() => {
    mocks.replace.mockReset();
  });

  it("hides chapter content from a visitor and uses the established safe login redirect", async () => {
    mocks.useSession.mockReturnValue({
      data: null,
      error: null,
      isPending: false,
      isFetched: true,
      isError: false,
    });
    render(<ChapterReadingPage />);

    expect(
      screen.queryByText("Fixture chapter content"),
    ).not.toBeInTheDocument();
    await waitFor(() => {
      expect(mocks.replace).toHaveBeenCalledWith("/auth/login");
    });
  });

  it("renders the chapter for an active verified account", () => {
    mocks.useSession.mockReturnValue({
      data: account,
      error: null,
      isPending: false,
      isFetched: true,
      isError: false,
    });
    render(<ChapterReadingPage />);
    expect(screen.getByText("Fixture chapter content")).toBeInTheDocument();
  });

  it("hides chapter content while the session check is pending", () => {
    mocks.useSession.mockReturnValue({
      data: null,
      error: null,
      isPending: true,
      isFetched: false,
      isError: false,
    });
    render(<ChapterReadingPage />);
    expect(
      screen.queryByText("Fixture chapter content"),
    ).not.toBeInTheDocument();
    expect(mocks.replace).not.toHaveBeenCalled();
  });

  it("hides chapter content for a suspended account", async () => {
    mocks.useSession.mockReturnValue({
      data: { user: { ...account.user, status: "SUSPENDED" } },
      error: null,
      isPending: false,
      isFetched: true,
      isError: false,
    });
    render(<ChapterReadingPage />);
    expect(
      screen.queryByText("Fixture chapter content"),
    ).not.toBeInTheDocument();
    await waitFor(() => {
      expect(mocks.replace).toHaveBeenCalledWith("/auth/verify-email");
    });
  });

  it("hides chapter content and offers retry on session failure", () => {
    mocks.useSession.mockReturnValue({
      data: null,
      error: new Error("offline"),
      isPending: false,
      isFetched: true,
      isError: true,
      refetch: vi.fn(),
    });
    render(<ChapterReadingPage />);
    expect(
      screen.queryByText("Fixture chapter content"),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "إعادة المحاولة" }),
    ).toBeInTheDocument();
  });
});
