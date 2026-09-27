import { useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AdminDataProvider, useAdminData } from "./admin-context";

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

function FixtureBoundaryProbe() {
  const context = useAdminData();
  return (
    <>
      <output data-testid="chapter-state-present">
        {String("chapters" in context || "getChapters" in context)}
      </output>
      <output data-testid="work-state-present">
        {String("works" in context)}
      </output>
      <output data-testid="work-actions-present">
        {String("createWork" in context || "resetToFixtures" in context)}
      </output>
    </>
  );
}

describe("admin fixture state", () => {
  it("excludes Chapter state and Work replacement state from the fixture context", () => {
    render(
      <AdminDataProvider>
        <FixtureBoundaryProbe />
      </AdminDataProvider>,
    );
    expect(screen.getByTestId("chapter-state-present")).toHaveTextContent(
      "false",
    );
    expect(screen.getByTestId("work-state-present")).toHaveTextContent("false");
    expect(screen.getByTestId("work-actions-present")).toHaveTextContent(
      "false",
    );
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
