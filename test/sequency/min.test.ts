import { describe, it, expect } from "vitest";
import { emptySequence, sequenceOf } from "../../src/Sequence";

describe("min", () => {
  it("should return min element", () => {
    const num = sequenceOf(3, 1, 2, 6, 3).min();
    expect(num).toBe(1);
  });

  it("should return undefined on empty sequence", () => {
    const num = emptySequence().min();
    expect(num).toBeUndefined();
  });
});
