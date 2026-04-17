import { describe, it, expect } from "vitest";
import { sequenceOf } from "../../src/Sequence";

describe("every", () => {
  it("should return false", () => {
    const result = sequenceOf(1, 2, 3).every(it => it > 1);
    expect(result).toBe(false);
  });

  it("should return true", () => {
    const result = sequenceOf(1, 2, 3).every(it => it > 0);
    expect(result).toBe(true);
  });
});
