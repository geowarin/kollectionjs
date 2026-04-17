import { describe, it, expect } from "vitest";
import { entriesOf, sequenceOf } from "../../src/Sequence";

describe("toObject", () => {
  it("should collect pairs into a plain object", () => {
    const result = entriesOf({ name: "yoda" })
      .mapKeys(k => k.toUpperCase())
      .mapValues(v => v.toUpperCase())
      .toObject();
    expect(result).toEqual({ NAME: "YODA" });
  });

  it("should work on a sequence of pairs directly", () => {
    const result = sequenceOf<[string, number]>(["a", 1], ["b", 2]).toObject();
    expect(result).toEqual({ a: 1, b: 2 });
  });

  it("should overwrite duplicate keys with the last value", () => {
    const result = sequenceOf<[string, number]>(["a", 1], ["a", 2]).toObject();
    expect(result).toEqual({ a: 2 });
  });
});
