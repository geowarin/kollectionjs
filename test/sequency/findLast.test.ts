import { describe, it, expect } from "vitest";
import { sequenceOf } from "../../src/Sequence";

describe("findLast", () => {
  it("should return last element of sequence", () => {
    const result = sequenceOf(1, 2, 3).findLast();
    expect(result).toBe(3);
  });

  it("should return undefined on empty sequence", () => {
    const result = sequenceOf(1, 2, 3)
      .filter((it) => it > 3)
      .findLast();
    expect(result).toBeUndefined();
  });

  it("should return last element matching predicate", () => {
    const result = sequenceOf(1, 2, 3).findLast((it) => it > 1);
    expect(result).toBe(3);
  });
});
