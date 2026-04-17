import { describe, it, expect } from "vitest";
import { sequenceOf } from "../../src/Sequence";

describe("sorted", () => {
  it("should sort strings alphabetically", () => {
    const array = sequenceOf("banana", "apple", "cherry").sorted().toArray();
    expect(array).toEqual(["apple", "banana", "cherry"]);
  });

  it("should return empty sequence unchanged", () => {
    expect(sequenceOf<string>().sorted().toArray()).toEqual([]);
  });

  it("should sort numbers numerically, not lexicographically", () => {
    expect(sequenceOf(10, 2, 1).sorted().toArray()).toEqual([1, 2, 10]);
  });

  it("sortedDescending should sort in reverse order", () => {
    expect(sequenceOf("banana", "apple", "cherry").sortedDescending().toArray()).toEqual([
      "cherry",
      "banana",
      "apple",
    ]);
  });
});
