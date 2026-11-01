import { describe, expect, it } from "vitest";
import { progressiveImagePlan } from "./progressive-images";

describe("bounded illustrated-page policy", () => {
  it("prepares ten initially and extends to twenty at page five without duplicate ranks", () => {
    expect(progressiveImagePlan(100, 0, "continuous", false)).toMatchObject({
      from: 0,
      to: 10,
      concurrency: 2,
      current: 0,
    });
    const next = progressiveImagePlan(100, 4, "continuous", false);
    expect(next).toMatchObject({ from: 2, to: 20 });
    expect(next.priority.slice(0, 5)).toEqual([4, 5, 3, 6, 2]);
    expect(new Set(next.priority).size).toBe(next.priority.length);
    expect(next.priority.every((index) => index < 20)).toBe(true);
  });
  it("reprioritizes direct jumps and reversal within finite forward/rear windows", () => {
    for (const position of [49, 2, 99, 0]) {
      const plan = progressiveImagePlan(100, position, "continuous", false);
      expect(plan.priority[0]).toBe(position);
      expect(plan.from).toBe(Math.max(0, position - 2));
      expect(plan.to).toBeLessThanOrEqual(Math.min(100, position + 20));
      expect(plan.priority.length).toBeLessThanOrEqual(20);
    }
  });
  it("conservatively bounds single-page and slow/save-data work while retaining visible priority", () => {
    expect(progressiveImagePlan(30, 0, "continuous", true)).toMatchObject({
      to: 5,
      concurrency: 1,
      priority: [0, 1, 2, 3, 4],
    });
    expect(progressiveImagePlan(30, 2, "continuous", true).to).toBe(10);
    expect(progressiveImagePlan(30, 15, "single", false).priority).toEqual([
      15, 16, 14, 17, 18,
    ]);
    expect(progressiveImagePlan(30, 15, "single", true).priority).toEqual([
      15, 16, 14,
    ]);
    expect(progressiveImagePlan(0, 50, "continuous", false).priority).toEqual(
      [],
    );
  });
});
