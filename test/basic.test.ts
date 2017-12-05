import {sequenceOf} from "../src/Sequence";
import {getIterator} from "../src/utils";

describe("sequence", () => {
  it("is iterable", () => {
    const sequence = sequenceOf(1, 2, 3);
    let iterator = getIterator(sequence);
    expect(iterator.next().value).toEqual(1);
    expect(iterator.next().value).toEqual(2);
    expect(iterator.next().value).toEqual(3);
    expect(iterator.next().value).toEqual(undefined);
  });
});