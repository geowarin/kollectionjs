import { describe, it, expect } from "vitest";
import { sequenceOf } from "../../src/Sequence";

describe("filter", () => {
  it("should filter elements", () => {
    const array = sequenceOf(1, 2, 3)
      .filter(it => it > 1)
      .toArray();

    expect(array.length).toBe(2);
    expect(array[0]).toBe(2);
    expect(array[1]).toBe(3);
  });

  it("should filter elements by index", () => {
    const array = sequenceOf(1, 2, 3)
      .filter((_it, index) => index < 2)
      .toArray();

    expect(array.length).toBe(2);
    expect(array[0]).toBe(1);
    expect(array[1]).toBe(2);
  });
});
