import { describe, it, expect } from "vitest";
import { concat, emptySequence, sequenceOf } from "../../src/Sequence";

describe("concat", () => {
  it("should concatenate multiple sequences", () => {
    const result = concat(sequenceOf(1, 2), sequenceOf(3, 4), sequenceOf(5, 6)).toArray();
    expect(result).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it("should work with arrays and sequences mixed", () => {
    const result = concat(sequenceOf(1, 2), [3, 4]).toArray();
    expect(result).toEqual([1, 2, 3, 4]);
  });

  it("should return empty sequence when given no arguments", () => {
    expect(concat().toArray()).toEqual([]);
  });

  it("should skip empty iterables", () => {
    const result = concat(sequenceOf(1), emptySequence<number>(), sequenceOf(2)).toArray();
    expect(result).toEqual([1, 2]);
  });
});
