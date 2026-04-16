import { describe, it, expect } from "vitest";
import { sequenceOf } from "../../src/Sequence";

describe("chunk", () => {
  it("should return a sequence of chunks", () => {
    const chunks = sequenceOf(1, 2, 3, 4, 5).chunk(2).toArray();
    expect(chunks).toEqual([[1, 2], [3, 4], [5]]);
  });

  it("should return single chunk when size exceeds sequence length", () => {
    const chunks = sequenceOf(1, 2, 3).chunk(5).toArray();
    expect(chunks).toEqual([[1, 2, 3]]);
  });

  it("should return one-element chunks", () => {
    const chunks = sequenceOf(1, 2, 3).chunk(1).toArray();
    expect(chunks).toEqual([[1], [2], [3]]);
  });

  it("should be lazy and only consume what is needed", () => {
    let consumed = 0;
    const chunks = sequenceOf(1, 2, 3, 4, 5, 6)
      .onEach(() => consumed++)
      .chunk(2)
      .take(2)
      .toArray();
    expect(chunks).toEqual([[1, 2], [3, 4]]);
    expect(consumed).toBe(4);
  });

  it("should throw when chunkSize is less than 1", () => {
    expect(() => sequenceOf(1, 2, 3).chunk(0)).toThrow();
    expect(() => sequenceOf(1, 2, 3).chunk(-1)).toThrow();
  });
});
