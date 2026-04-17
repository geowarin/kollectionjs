import { describe, it, expect } from "vitest";
import { sequenceOf } from "../../src/Sequence";

describe("sortedBy", () => {
  it("should sort by numeric selector", () => {
    const array = sequenceOf(3, 1, 2)
      .sortedBy((it) => it)
      .toArray();
    expect(array).toEqual([1, 2, 3]);
  });

  it("should sort objects by property", () => {
    const a = { name: "Charlie", age: 30 };
    const b = { name: "Alice", age: 25 };
    const c = { name: "Bob", age: 35 };
    const array = sequenceOf(a, b, c)
      .sortedBy((it) => it.age)
      .toArray();
    expect(array).toEqual([b, a, c]);
  });

  it("should sort by string property", () => {
    const a = { name: "Charlie" };
    const b = { name: "Alice" };
    const c = { name: "Bob" };
    const array = sequenceOf(a, b, c)
      .sortedBy((it) => it.name)
      .toArray();
    expect(array).toEqual([b, c, a]);
  });

  it("sortedByDescending should sort by selector in descending order", () => {
    const a = { name: "Charlie", age: 30 };
    const b = { name: "Alice", age: 25 };
    const c = { name: "Bob", age: 35 };
    const array = sequenceOf(a, b, c)
      .sortedByDescending((it) => it.age)
      .toArray();
    expect(array).toEqual([c, a, b]);
  });
});
