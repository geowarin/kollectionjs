import { describe, it, expect } from "vitest";
import { sequenceOf } from "../../src/Sequence";

describe("find", () => {
  it("should return first element of sequence", () => {
    const result = sequenceOf(1, 2, 3)
      .filter((it) => it > 2)
      .find();
    expect(result).toBe(3);
  });

  it("should return undefined on empty sequence", () => {
    const result = sequenceOf(1, 2, 3)
      .filter((it) => it > 3)
      .find();
    expect(result).toBeUndefined();
  });

  it("should return first element matching predicate", () => {
    const result = sequenceOf(1, 2, 3).find((it) => it > 2);
    expect(result).toBe(3);
  });
});
