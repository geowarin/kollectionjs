import { describe, it, expect } from "vitest";
import { sequenceOf } from "../../src/Sequence";

describe("map", () => {
  it("should map numbers to strings", () => {
    const array = sequenceOf(1, 2, 3)
      .map(it => `num ${it}`)
      .toArray();

    expect(array.length).toBe(3);
    expect(array[0]).toBe("num 1");
    expect(array[1]).toBe("num 2");
    expect(array[2]).toBe("num 3");
  });

  it("should map elements with index", () => {
    const array = sequenceOf(1, 2, 3)
      .map((it, index) => `${index}: ${it}`)
      .toArray();

    expect(array.length).toBe(3);
    expect(array[0]).toBe("0: 1");
    expect(array[1]).toBe("1: 2");
    expect(array[2]).toBe("2: 3");
  });
});
