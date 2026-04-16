import { describe, it, expect } from "vitest";
import { emptySequence, sequenceOf } from "../../src/Sequence";

describe("minWith", () => {
  it("should return min element by comparator", () => {
    const num = sequenceOf({ a: 1 }, { a: 3 }, { a: 2 }).minWith((o1, o2) =>
      o1.a > o2.a ? 1 : o1.a < o2.a ? -1 : 0,
    );
    expect(num).toEqual({ a: 1 });
  });

  it("should return undefined on empty sequence", () => {
    const num = emptySequence().minWith(() => 0);
    expect(num).toBeUndefined();
  });
});
