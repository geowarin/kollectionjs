import { describe, it, expect } from "vitest";
import { entriesOf, sequenceOf } from "../../src/Sequence";

describe("filterKeys", () => {
  it("should keep only pairs whose key satisfies the predicate", () => {
    const result = sequenceOf<[string, number]>(["a", 1], ["b", 2], ["c", 3])
      .filterKeys(k => k !== "b")
      .toArray();
    expect(result).toEqual([["a", 1], ["c", 3]]);
  });

  it("should work with entriesOf", () => {
    const result = entriesOf({ name: "yoda", side: "light", age: 900 })
      .filterKeys(k => k.length > 3)
      .toObject();
    expect(result).toEqual({ name: "yoda", side: "light" });
  });

  it("should return empty when no keys match", () => {
    const result = sequenceOf<[string, number]>(["a", 1], ["b", 2])
      .filterKeys(() => false)
      .toArray();
    expect(result).toEqual([]);
  });
});
