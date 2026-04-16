import { describe, it, expect } from "vitest";
import { emptySequence, sequenceOf } from "../../src/Sequence";

describe("scan", () => {
  it("should emit initial value then each running accumulation", () => {
    const result = sequenceOf(1, 2, 3, 4).scan(0, (acc, it) => acc + it).toArray();
    expect(result).toEqual([0, 1, 3, 6, 10]);
  });

  it("should return only the initial value for empty sequence", () => {
    const result = emptySequence<number>().scan(0, (acc, it) => acc + it).toArray();
    expect(result).toEqual([0]);
  });

  it("should work with non-numeric accumulator", () => {
    const result = sequenceOf("a", "b", "c").scan("", (acc, it) => acc + it).toArray();
    expect(result).toEqual(["", "a", "ab", "abc"]);
  });

  it("runningFold should be an alias for scan", () => {
    const scan = sequenceOf(1, 2, 3).scan(0, (acc, it) => acc + it).toArray();
    const fold = sequenceOf(1, 2, 3).runningFold(0, (acc, it) => acc + it).toArray();
    expect(fold).toEqual(scan);
  });
});
