import { describe, it, expect } from "vitest";
import { emptySequence, sequenceOf } from "../../src/Sequence";

describe("zipWithNext", () => {
  it("should produce consecutive pairs", () => {
    const result = sequenceOf(1, 2, 3, 4).zipWithNext().toArray();
    expect(result).toEqual([[1, 2], [2, 3], [3, 4]]);
  });

  it("should apply transform to each pair", () => {
    const result = sequenceOf(1, 4, 9, 16).zipWithNext((a, b) => b - a).toArray();
    expect(result).toEqual([3, 5, 7]);
  });

  it("should return empty for a single-element sequence", () => {
    expect(sequenceOf(1).zipWithNext().toArray()).toEqual([]);
  });

  it("should return empty for empty sequence", () => {
    expect(emptySequence<number>().zipWithNext().toArray()).toEqual([]);
  });
});
