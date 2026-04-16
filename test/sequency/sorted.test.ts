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
});
