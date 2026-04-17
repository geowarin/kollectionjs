import { describe, it, expect } from "vitest";
import { sequenceOf } from "../../src/Sequence";

describe("count", () => {
  it("should count results", () => {
    const num = sequenceOf(1, 2, 3).count();
    expect(num).toBe(3);
  });

  it("should evaluate predicate and count results", () => {
    const num = sequenceOf(1, 2, 3).count(it => it > 1);
    expect(num).toBe(2);
  });

  it("should count all elements including falsy values", () => {
    expect(sequenceOf(0, 1, 2).count()).toBe(3);
  });
});
