import {getIterableIterator} from "./utils";
import {Pipeline, Operation} from "./Pipeline";

export class Sequence<T> implements Iterable<T> {
  private pipeline: any;

  constructor(args: T[]) {
    this.pipeline = new Pipeline(getIterableIterator(args));
  }

  [Symbol.iterator](): Iterator<T> {
    return getIterableIterator(this.pipeline);
  }

  filter(predicate: (item: T) => boolean): Sequence<T> {
    this.pipeline.addOperation(
      function* (prev: Operation) {
        for (let val of prev.iterator()) {
          if (predicate(val))
            yield val;
        }
      }
    );
    return this;
  }

  map<U, S>(transform: (element: T) => S): Sequence<U> {
    this.pipeline.addOperation(
      function* (prev: Operation) {
        let index = 0;
        for (let val of prev.iterator()) {
          yield transform(val, index++);
        }
      }
    );
    return this as any;
  }

  toArray(): T[] {
    return [...this];
  }
}

export function sequenceOf<T>(...args: T[]): Sequence<T> {
  return new Sequence(args);
}