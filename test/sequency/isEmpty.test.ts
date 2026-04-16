import { describe, it, expect } from "vitest";
import { emptySequence, sequenceOf } from "../../src/Sequence";

describe("isEmpty / isNotEmpty", () => {
  it("isEmpty should return true for empty sequence", () => {
    expect(emptySequence().isEmpty()).toBe(true);
  });

  it("isEmpty should return false for non-empty sequence", () => {
    expect(sequenceOf(1).isEmpty()).toBe(false);
  });

  it("isNotEmpty should return false for empty sequence", () => {
    expect(emptySequence().isNotEmpty()).toBe(false);
  });

  it("isNotEmpty should return true for non-empty sequence", () => {
    expect(sequenceOf(1).isNotEmpty()).toBe(true);
  });
});
