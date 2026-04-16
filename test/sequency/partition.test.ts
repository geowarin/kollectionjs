import { describe, it, expect } from "vitest";
import { sequenceOf } from "../../src/Sequence";

describe("partition", () => {
  it("should partition based on the given predicate", () => {
    const [odds, evens] = sequenceOf(1, 2, 3, 4).partition((it) => it % 2 === 1);

    expect(odds).toEqual([1, 3]);
    expect(evens).toEqual([2, 4]);
  });
});
