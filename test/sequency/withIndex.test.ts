import { describe, it, expect } from "vitest";
import { sequenceOf } from "../../src/Sequence";

describe("withIndex", () => {
  it("should pair each element with its index", () => {
    const result = sequenceOf("a", "b", "c").withIndex().toArray();
    expect(result).toEqual([
      { index: 0, value: "a" },
      { index: 1, value: "b" },
      { index: 2, value: "c" },
    ]);
  });

  it("should be usable in a lazy chain", () => {
    const result = sequenceOf("x", "y", "z")
      .withIndex()
      .filter(({ index }) => index % 2 === 0)
      .map(({ value }) => value)
      .toArray();
    expect(result).toEqual(["x", "z"]);
  });
});
