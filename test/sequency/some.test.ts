import { describe, it, expect } from "vitest";
import { sequenceOf } from "../../src/Sequence";

describe("some", () => {
  it("should return false on empty sequence", () => {
    const result = sequenceOf(1, 2, 3)
      .filter(it => it > 3)
      .some();
    expect(result).toBe(false);
  });

  it("should return true on non-empty sequence", () => {
    const result = sequenceOf(1, 2, 3)
      .filter(it => it > 1)
      .some();
    expect(result).toBe(true);
  });

  it("should evaluate predicate and return false", () => {
    const result = sequenceOf(1, 2, 3).some(it => it > 3);
    expect(result).toBe(false);
  });

  it("should evaluate predicate and return true", () => {
    const result = sequenceOf(1, 2, 3).some(it => it > 2);
    expect(result).toBe(true);
  });
});
