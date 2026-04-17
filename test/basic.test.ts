import { describe, it, expect } from "vitest";
import { asSequence, sequenceOf } from "../src/Sequence";
import { getIterator } from "../src/utils";

describe("sequence", () => {
  it("is iterable", () => {
    const sequence = sequenceOf(1, 2, 3);
    let iterator = getIterator(sequence);
    expect(iterator.next().value).toEqual(1);
    expect(iterator.next().value).toEqual(2);
    expect(iterator.next().value).toEqual(3);
    expect(iterator.next().value).toEqual(undefined);
  });

  it("can chain operations", () => {
    const sequence = sequenceOf(1, 2, 3);
    let result = sequence
      .map((it) => it * 2)
      .filter((it) => it % 3 == 0)
      .toArray();

    expect(result).toEqual([6]);
  });

  it("is a native Iterator — built-in methods are available directly", () => {
    const seq = sequenceOf(1, 2, 3, 4, 5);

    expect(seq.every((x) => x > 0)).toBe(true);
    expect(sequenceOf(1, 2, 3, 4, 5).some((x) => x > 4)).toBe(true);
    expect(sequenceOf(1, 2, 3, 4, 5).find((x) => x > 3)).toBe(4);
    expect(sequenceOf(1, 2, 3).toArray()).toEqual([1, 2, 3]);
    expect(sequenceOf(1, 2, 3).reduce((acc, x) => acc + x)).toBe(6);

    const visited: number[] = [];
    sequenceOf(1, 2, 3).forEach((x) => visited.push(x));
    expect(visited).toEqual([1, 2, 3]);
  });
});
