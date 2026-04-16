import { describe, it, expect } from "vitest";
import { emptySequence, sequenceOf } from "../../src/Sequence";

describe("singleOrNull", () => {
  it("should return single element", () => {
    const result = sequenceOf(23).singleOrNull();
    expect(result).toBe(23);
  });

  it("should return undefined with more than one element", () => {
    const result = sequenceOf(1, 2).singleOrNull();
    expect(result).toBeUndefined();
  });

  it("should return undefined with zero elements", () => {
    const result = emptySequence().singleOrNull();
    expect(result).toBeUndefined();
  });

  it("should evaluate predicate and return single element", () => {
    const result = sequenceOf(1, 2, 3).singleOrNull((it) => it > 2);
    expect(result).toBe(3);
  });

  it("should evaluate predicate and return null with more than one element", () => {
    const result = sequenceOf(1, 2, 3).singleOrNull((it) => it > 1);
    expect(result).toBeUndefined();
  });

  it("should evaluate predicate and return null with zero elements", () => {
    const result = sequenceOf(1, 2, 3).singleOrNull((it) => it > 3);
    expect(result).toBeUndefined();
  });
});
