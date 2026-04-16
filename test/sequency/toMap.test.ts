import { describe, it, expect } from "vitest";
import { sequenceOf } from "../../src/Sequence";

describe("toMap", () => {
  it("should convert a sequence of pairs to a Map", () => {
    const map = sequenceOf<[string, number]>(["a", 1], ["b", 2], ["c", 3]).toMap();
    expect(map.get("a")).toBe(1);
    expect(map.get("b")).toBe(2);
    expect(map.get("c")).toBe(3);
    expect(map.size).toBe(3);
  });

  it("should overwrite duplicate keys with the last value", () => {
    const map = sequenceOf<[string, number]>(["a", 1], ["a", 2]).toMap();
    expect(map.size).toBe(1);
    expect(map.get("a")).toBe(2);
  });

  it("should work with zip output", () => {
    const map = sequenceOf("x", "y", "z").zip(sequenceOf(1, 2, 3)).toMap();
    expect(map.get("x")).toBe(1);
    expect(map.get("z")).toBe(3);
  });
});
