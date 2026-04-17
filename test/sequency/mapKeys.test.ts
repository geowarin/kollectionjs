import { describe, it, expect } from "vitest";
import { entriesOf, sequenceOf } from "../../src/Sequence";

describe("mapKeys", () => {
  it("should transform keys", () => {
    const result = entriesOf({ name: "yoda" })
      .mapKeys(k => k.toUpperCase())
      .toArray();
    expect(result).toEqual([["NAME", "yoda"]]);
  });

  it("should work with sequenceOf pairs", () => {
    const result = sequenceOf<[string, number]>(["a", 1], ["b", 2])
      .mapKeys(k => k.toUpperCase())
      .toArray();
    expect(result).toEqual([
      ["A", 1],
      ["B", 2],
    ]);
  });

  it("should chain with mapValues", () => {
    const result = entriesOf({ name: "yoda" })
      .mapKeys(k => k.toUpperCase())
      .mapValues(v => v.toUpperCase())
      .toArray();
    expect(result).toEqual([["NAME", "YODA"]]);
  });
});
