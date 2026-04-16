import { describe, it, expect } from "vitest";
import { emptySequence, sequenceOf } from "../../src/Sequence";

describe("windowed", () => {
  it("should produce sliding windows of the given size", () => {
    const result = sequenceOf(1, 2, 3, 4, 5).windowed(3).toArray();
    expect(result).toEqual([[1, 2, 3], [2, 3, 4], [3, 4, 5]]);
  });

  it("should respect a custom step", () => {
    const result = sequenceOf(1, 2, 3, 4, 5).windowed(3, 2).toArray();
    expect(result).toEqual([[1, 2, 3], [3, 4, 5]]);
  });

  it("should include partial windows when partialWindows is true", () => {
    const result = sequenceOf(1, 2, 3, 4, 5).windowed(3, 2, true).toArray();
    expect(result).toEqual([[1, 2, 3], [3, 4, 5], [5]]);
  });

  it("should handle step larger than size", () => {
    const result = sequenceOf(1, 2, 3, 4, 5, 6).windowed(2, 3).toArray();
    expect(result).toEqual([[1, 2], [4, 5]]);
  });

  it("should return empty for empty sequence", () => {
    expect(emptySequence<number>().windowed(3).toArray()).toEqual([]);
  });

  it("should throw when size is less than 1", () => {
    expect(() => sequenceOf(1, 2, 3).windowed(0)).toThrow("size must be > 0");
  });

  it("should throw when step is less than 1", () => {
    expect(() => sequenceOf(1, 2, 3).windowed(2, 0)).toThrow("step must be > 0");
  });
});
