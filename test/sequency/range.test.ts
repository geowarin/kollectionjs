import { describe, it, expect } from "vitest";
import { range } from "../../src/Sequence";

describe("range", () => {
  it("should generate a range of numbers", () => {
    expect(range(1, 5).toArray()).toEqual([1, 2, 3, 4]);
  });

  it("should generate a range with a step", () => {
    expect(range(0, 10, 2).toArray()).toEqual([0, 2, 4, 6, 8]);
  });

  it("should generate a descending range with a negative step", () => {
    expect(range(5, 1, -1).toArray()).toEqual([5, 4, 3, 2]);
  });

  it("should return empty sequence when start equals end", () => {
    expect(range(3, 3).toArray()).toEqual([]);
  });

  it("should throw when step is zero", () => {
    expect(() => range(0, 5, 0)).toThrow("step must not be zero");
  });
});
