import { describe, it, expect } from "vitest";
import { emptySequence, sequenceOf } from "../../src/Sequence";

describe("joinToString", () => {
  it("should join with default separator", () => {
    expect(sequenceOf(1, 2, 3).joinToString()).toBe("1, 2, 3");
  });

  it("should join with custom separator", () => {
    expect(sequenceOf(1, 2, 3).joinToString({ separator: " | " })).toBe("1 | 2 | 3");
  });

  it("should wrap with prefix and postfix", () => {
    expect(sequenceOf(1, 2, 3).joinToString({ prefix: "[", postfix: "]" })).toBe("[1, 2, 3]");
  });

  it("should apply transform to each element", () => {
    const result = sequenceOf({ name: "Alice" }, { name: "Bob" }).joinToString({
      transform: it => it.name,
    });
    expect(result).toBe("Alice, Bob");
  });

  it("should combine all options", () => {
    const result = sequenceOf(1, 2, 3).joinToString({
      separator: "-",
      prefix: "(",
      postfix: ")",
      transform: it => String(it * 2),
    });
    expect(result).toBe("(2-4-6)");
  });

  it("should return empty string for empty sequence", () => {
    expect(emptySequence().joinToString()).toBe("");
  });

  it("should return prefix and postfix for empty sequence", () => {
    expect(emptySequence().joinToString({ prefix: "[", postfix: "]" })).toBe("[]");
  });
});
