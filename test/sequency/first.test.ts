import { describe, it, expect } from "vitest";
import { sequenceOf } from "../../src/Sequence";

describe("first", () => {
  it("should return first element of sequence", () => {
    const result = sequenceOf(1, 2, 3)
      .filter(it => it > 2)
      .first();
    expect(result).toBe(3);
  });

  it("should return undefined on empty sequence", () => {
    const result = sequenceOf(1, 2, 3)
      .filter(it => it > 3)
      .first();
    expect(result).toBeUndefined();
  });

  it("should return first element matching predicate", () => {
    const result = sequenceOf(1, 2, 3).first(it => it > 2);
    expect(result).toBe(3);
  });

  it("should return null if the first element is null", () => {
    const result = sequenceOf(null).first();
    expect(result).toBeNull();
  });
});
