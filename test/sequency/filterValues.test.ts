import { describe, it, expect } from "vitest";
import { entriesOf, sequenceOf } from "../../src/Sequence";

describe("filterValues", () => {
  it("should keep only pairs whose value satisfies the predicate", () => {
    const result = sequenceOf<[string, number]>(["a", 1], ["b", 2], ["c", 3])
      .filterValues(v => v > 1)
      .toArray();
    expect(result).toEqual([["b", 2], ["c", 3]]);
  });

  it("should work with entriesOf", () => {
    const result = entriesOf({ name: "yoda", side: "light", title: "master" })
      .filterValues(v => v.length <= 5)
      .toObject();
    expect(result).toEqual({ name: "yoda", side: "light" });
  });

  it("should return empty when no values match", () => {
    const result = sequenceOf<[string, number]>(["a", 1], ["b", 2])
      .filterValues(() => false)
      .toArray();
    expect(result).toEqual([]);
  });
});
