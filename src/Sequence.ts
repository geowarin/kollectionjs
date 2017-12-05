import {getIterator} from "./utils";
import {Pipeline} from "./Pipeline";

export class Sequence<T> implements Iterable<T> {
  private pipeline: any;

  constructor(args: T[]) {
    this.pipeline = new Pipeline(getIterator(args));
  }

  [Symbol.iterator](): Iterator<T> {
    return getIterator(this.pipeline);
  }
}

export function sequenceOf<T>(...args: T[]): Sequence<T> {
  return new Sequence(args);
}