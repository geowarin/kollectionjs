import { describe, it, expect } from "vitest";
import { emptySequence, sequenceOf } from "../../src/Sequence";

describe("fold", () => {
  it("should 23 + sum of all numbers", () => {
    const result = sequenceOf(1, 2, 3).fold(23, (acc, value) => acc + value);
    expect(result).toBe(29);
  });

  it("should return initial value on empty sequence", () => {
    const result = emptySequence().fold(23, (acc, value) => acc + (value as number));
    expect(result).toBe(23);
  });

  it("should 23 + sum of all numbers and indices", () => {
    const result = sequenceOf(1, 2, 3).fold(23, (acc, value, index) => acc + value + index);
    expect(result).toBe(32);
  });

  it("should return initial value on empty sequence", () => {
    const result = emptySequence().fold(23, (acc, value, index) => acc + (value as number) + index);
    expect(result).toBe(23);
  });
});
