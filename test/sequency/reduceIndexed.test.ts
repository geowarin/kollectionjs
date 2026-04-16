import { describe, it, expect } from "vitest";
import { sequenceOf } from "../../src/Sequence";

describe("reduceIndexed", () => {
  it("should sum all numbers + indices", () => {
    const result = sequenceOf(1, 2, 3).reduceIndexed(
      (acc: number, value: number, index: number) => acc + value + index,
    );
    expect(result).toBe(9);
  });
});
