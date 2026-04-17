import { describe, it, expect } from "vitest";
import { sequenceOf } from "../../src/Sequence";

describe("sortedWith", () => {
  it("should sort using a comparator", () => {
    const array = sequenceOf(3, 1, 2)
      .sortedWith((a, b) => a - b)
      .toArray();
    expect(array).toEqual([1, 2, 3]);
  });

  it("should sort in descending order with reversed comparator", () => {
    const array = sequenceOf(3, 1, 2)
      .sortedWith((a, b) => b - a)
      .toArray();
    expect(array).toEqual([3, 2, 1]);
  });

  it("should sort objects with a multi-field comparator", () => {
    const a = { name: "Alice", age: 30 };
    const b = { name: "Alice", age: 25 };
    const c = { name: "Bob", age: 20 };
    const array = sequenceOf(a, b, c)
      .sortedWith((x, y) => x.name.localeCompare(y.name) || x.age - y.age)
      .toArray();
    expect(array).toEqual([b, a, c]);
  });
});
