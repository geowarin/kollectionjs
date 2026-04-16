import { describe, it, expect } from "vitest";
import { sequenceOf } from "../../src/Sequence";

describe("lastOrNull", () => {
  it("should return last element of sequence", () => {
    const result = sequenceOf(1, 2, 3).lastOrNull();
    expect(result).toBe(3);
  });

  it("should return undefined on empty sequence", () => {
    const result = sequenceOf(1, 2, 3)
      .filter((it) => it > 3)
      .lastOrNull();
    expect(result).toBeUndefined();
  });

  it("should return last element matching predicate", () => {
    const result = sequenceOf(1, 2, 3).lastOrNull((it) => it > 1);
    expect(result).toBe(3);
  });
});
