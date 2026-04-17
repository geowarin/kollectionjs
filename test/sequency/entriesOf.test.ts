import { describe, it, expect } from "vitest";
import { entriesOf } from "../../src/Sequence";

describe("entriesOf", () => {
  it("should create a sequence of [key, value] pairs", () => {
    expect(entriesOf({ a: 1, b: 2 }).toArray()).toEqual([["a", 1], ["b", 2]]);
  });

  it("should work on an empty object", () => {
    expect(entriesOf({}).toArray()).toEqual([]);
  });
});
