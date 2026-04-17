import { describe, it, expect } from "vitest";
import { sequenceOf } from "../../src/Sequence";

describe("last", () => {
  it("should return last element of sequence", () => {
    const result = sequenceOf(1, 2, 3)
      .filter(it => it > 1)
      .last();
    expect(result).toBe(3);
  });

  it("should return undefined on empty sequence", () => {
    const result = sequenceOf(1, 2, 3)
      .filter(it => it > 3)
      .last();
    expect(result).toBeUndefined();
  });

  it("should return last element matching predicate", () => {
    const result = sequenceOf(1, 2, 3).last(it => it > 1);
    expect(result).toBe(3);
  });

  it("should return null if the last element is null", () => {
    const result = sequenceOf(1, 2, null).last();
    expect(result).toBeNull();
  });

  it("should return undefined when predicate matches no elements", () => {
    const result = sequenceOf(1, 2, 3).last(it => it > 3);
    expect(result).toBeUndefined();
  });
});
