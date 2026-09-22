import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it } from "vitest";

import { useAdminDialogFocus } from "./use-admin-dialog-focus";

function DialogHarness() {
  const [isOpen, setIsOpen] = useState(false);
  const close = () => {
    setIsOpen(false);
  };
  const { dialogRef, onDialogKeyDown } = useAdminDialogFocus({
    isOpen,
    onClose: close,
  });

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setIsOpen(true);
        }}
      >
        Open dialog
      </button>
      {isOpen ? (
        <div
          ref={dialogRef}
          role="dialog"
          tabIndex={-1}
          onKeyDown={onDialogKeyDown}
        >
          <button type="button">First action</button>
          <button type="button">Last action</button>
        </div>
      ) : null}
    </>
  );
}

describe("useAdminDialogFocus", () => {
  it("traps focus, closes on Escape, and restores the opener", () => {
    render(<DialogHarness />);
    const opener = screen.getByRole("button", { name: "Open dialog" });
    opener.focus();

    fireEvent.click(opener);
    const dialog = screen.getByRole("dialog");
    const first = screen.getByRole("button", { name: "First action" });
    const last = screen.getByRole("button", { name: "Last action" });
    expect(first).toHaveFocus();

    last.focus();
    fireEvent.keyDown(dialog, { key: "Tab" });
    expect(first).toHaveFocus();

    fireEvent.keyDown(dialog, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(opener).toHaveFocus();
  });
});
