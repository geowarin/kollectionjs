import { describe, it, expect } from "vitest";
import { generate } from "../../src/Sequence";

describe("generate", () => {
  it("should generate values from a seed function", () => {
    const result = generate(1, (x) => x * 2).take(5).toArray();
    expect(result).toEqual([1, 2, 4, 8, 16]);
  });

  it("should stop when next returns null", () => {
    const result = generate(1, (x) => (x < 4 ? x + 1 : null)).toArray();
    expect(result).toEqual([1, 2, 3, 4]);
  });

  it("should stop when next returns undefined", () => {
    const result = generate(1, (x) => (x < 4 ? x + 1 : undefined)).toArray();
    expect(result).toEqual([1, 2, 3, 4]);
  });

  it("should return just the seed when next immediately returns null", () => {
    const result = generate(42, () => null).toArray();
    expect(result).toEqual([42]);
  });
});
