import { describe, it, expect } from "vitest";
import { sequenceOf } from "../../src/Sequence";

describe("associateWith", () => {
  it("should use elements as keys and selector result as values", () => {
    const result = sequenceOf("a", "bb", "ccc").associateWith(it => it.length);
    expect(result.get("a")).toBe(1);
    expect(result.get("bb")).toBe(2);
    expect(result.get("ccc")).toBe(3);
  });

  it("should overwrite duplicate keys with the last value", () => {
    const result = sequenceOf(1, 2, 1).associateWith(it => it * 10);
    expect(result.size).toBe(2);
    expect(result.get(1)).toBe(10);
  });
});
