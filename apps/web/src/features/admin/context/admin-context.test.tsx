import { useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AdminDataProvider, useAdminData } from "./admin-context";

function AdminStateProbe() {
  const { metrics, updateWork, toggleWorkPublish } = useAdminData();
  const [savedTitle, setSavedTitle] = useState("");

  return (
    <>
      <button
        onClick={() => {
          setSavedTitle(
            updateWork("trait-hoarder", { title: "Updated title" })?.title ??
              "missing",
          );
        }}
      >
        Save work
      </button>
      <button
        onClick={() => {
          toggleWorkPublish("trait-hoarder");
        }}
      >
        Unpublish work
      </button>
      <output>{savedTitle}</output>
      <span data-testid="published-count">{metrics.publishedWorks}</span>
      <span data-testid="draft-count">{metrics.draftWorks}</span>
    </>
  );
}

function GiftGrantProbe() {
  const { bulkGrantGift, grantRecords, getUser } = useAdminData();
  const [grantedIds, setGrantedIds] = useState<string[]>([]);
  const grantsMatchOwnership = grantedIds.every((id) => {
    const record = grantRecords.find((item) => item.id === id);
    return (
      record !== undefined &&
      getUser(record.userId)?.ownedGifts.some(
        (gift) => gift.grantId === record.id,
      )
    );
  });

  return (
    <>
      <button
        onClick={() => {
          const result = bulkGrantGift({
            giftId: "ember-ring",
            reason: "Test grant",
            notificationTitle: "Gift",
            notificationBody: "Gift granted",
          });
          setGrantedIds(result.records.map((record) => record.id));
        }}
      >
        Grant gift
      </button>
      <output data-testid="grant-count">{grantedIds.length}</output>
      <output data-testid="grant-relationships">
        {String(grantsMatchOwnership)}
      </output>
    </>
  );
}

describe("admin fixture state", () => {
  it("returns the edited work during the action", () => {
    render(
      <AdminDataProvider>
        <AdminStateProbe />
      </AdminDataProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Save work" }));

    expect(screen.getByText("Updated title")).toBeInTheDocument();
  });

  it("updates dashboard totals when publication changes", () => {
    render(
      <AdminDataProvider>
        <AdminStateProbe />
      </AdminDataProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Unpublish work" }));

    expect(screen.getByTestId("published-count")).toHaveTextContent("4");
    expect(screen.getByTestId("draft-count")).toHaveTextContent("3");
  });
  it("keeps bulk grant records linked to owned gifts", () => {
    render(
      <AdminDataProvider>
        <GiftGrantProbe />
      </AdminDataProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Grant gift" }));

    expect(
      Number(screen.getByTestId("grant-count").textContent),
    ).toBeGreaterThan(0);
    expect(screen.getByTestId("grant-relationships")).toHaveTextContent("true");
  });
});
