import { describe, it, expect } from "vitest";
import { entriesOf, sequenceOf } from "../../src/Sequence";

describe("mapValues", () => {
  it("should transform values", () => {
    const result = entriesOf({ name: "yoda" })
      .mapValues(v => v.toUpperCase())
      .toArray();
    expect(result).toEqual([["name", "YODA"]]);
  });

  it("should work with sequenceOf pairs", () => {
    const result = sequenceOf<[string, number]>(["a", 1], ["b", 2])
      .mapValues(v => v * 10)
      .toArray();
    expect(result).toEqual([
      ["a", 10],
      ["b", 20],
    ]);
  });

  it("should chain with mapKeys", () => {
    const result = entriesOf({ name: "yoda" })
      .mapValues(v => v.toUpperCase())
      .mapKeys(k => k.toUpperCase())
      .toArray();
    expect(result).toEqual([["NAME", "YODA"]]);
  });
});
