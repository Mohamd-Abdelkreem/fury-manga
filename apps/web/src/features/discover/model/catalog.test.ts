import { describe, expect, it } from "vitest";

import { DISCOVER_WORK_FIXTURES } from "../data/discoverData";
import { filterDiscoverWorks, parseDiscoverQuery } from "./catalog";

describe("discover catalog query", () => {
  it("normalizes supported URL parameters and rejects unknown sort values", () => {
    expect(
      parseDiscoverQuery({
        q: "  Boss  ",
        category: "action",
        status: "ongoing",
        type: "manhwa",
        sort: "title-asc",
      }),
    ).toEqual({
      q: "Boss",
      category: "action",
      status: "ongoing",
      type: "manhwa",
      sort: "title-asc",
    });
    expect(parseDiscoverQuery({ sort: "unknown" }).sort).toBe("default");
  });

  it("filters the shared catalog and applies stable supported sorting", () => {
    const filtered = filterDiscoverWorks(DISCOVER_WORK_FIXTURES, {
      q: "boss",
      category: "action",
      status: "ongoing",
      type: "manhwa",
      sort: "title-asc",
    });

    expect(filtered.map((work) => work.title)).toEqual(["Boss 99"]);

    const latest = filterDiscoverWorks(DISCOVER_WORK_FIXTURES, {
      q: "",
      category: "",
      status: "",
      type: "",
      sort: "latest",
    });
    const newest = latest[0];
    const oldest = latest.at(-1);
    expect(newest).toBeDefined();
    expect(oldest).toBeDefined();
    if (newest !== undefined && oldest !== undefined) {
      expect(newest.updatedAt >= oldest.updatedAt).toBe(true);
    }
  });

  it("includes text stories in global search results", () => {
    const results = filterDiscoverWorks(DISCOVER_WORK_FIXTURES, {
      q: "مدينة الكهرمان",
      category: "",
      status: "",
      type: "",
      sort: "default",
    });

    expect(results.map((work) => work.id)).toContain("city-of-amber");
  });
});
