import { describe, it, expect } from "vitest";
import { emptySequence, sequenceOf } from "../../src/Sequence";

describe("dropWhile", () => {
  it("should drop elements while predicate is true then yield the rest", () => {
    const result = sequenceOf(1, 2, 3, 2, 1)
      .dropWhile((it) => it < 3)
      .toArray();
    expect(result).toEqual([3, 2, 1]);
  });

  it("should yield all elements when predicate is immediately false", () => {
    expect(
      sequenceOf(3, 1, 2)
        .dropWhile((it) => it > 5)
        .toArray(),
    ).toEqual([3, 1, 2]);
  });

  it("should return empty when predicate is always true", () => {
    expect(
      sequenceOf(1, 2, 3)
        .dropWhile((it) => it > 0)
        .toArray(),
    ).toEqual([]);
  });

  it("should return empty for empty sequence", () => {
    expect(
      emptySequence<number>()
        .dropWhile((it) => it < 3)
        .toArray(),
    ).toEqual([]);
  });
});
