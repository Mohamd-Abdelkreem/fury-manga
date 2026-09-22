import { useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AdminConfirmDialog } from "./AdminConfirmDialog";

function DialogProbe() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => {
          setOpen(true);
        }}
      >
        Open dialog
      </button>
      <AdminConfirmDialog
        isOpen={open}
        title="Confirm"
        description="Proceed with the action?"
        confirmLabel="Continue"
        cancelLabel="Cancel"
        onConfirm={() => {
          setOpen(false);
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />
    </>
  );
}

describe("admin confirmation dialog", () => {
  it("keeps Tab inside the dialog and restores the opener after closing", () => {
    render(<DialogProbe />);
    const opener = screen.getByRole("button", { name: "Open dialog" });

    opener.focus();
    fireEvent.click(opener);

    const dialog = screen.getByRole("dialog");
    const confirm = screen.getByRole("button", { name: "Continue" });
    const cancel = screen.getByRole("button", { name: "Cancel" });
    expect(confirm).toHaveFocus();

    fireEvent.keyDown(dialog, { key: "Tab" });
    expect(cancel).toHaveFocus();

    fireEvent.keyDown(dialog, { key: "Tab", shiftKey: true });
    expect(confirm).toHaveFocus();

    fireEvent.keyDown(dialog, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(opener).toHaveFocus();
  });
});
