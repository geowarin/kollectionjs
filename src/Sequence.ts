import {getIterator, isIterable} from "./utils";

export class Sequence<T> implements IterableIterator<T> {
  _next: () => IteratorResult<T>;

  public next(): IteratorResult<T> {
    return this._next()
  }

  constructor(private iterator: Iterator<T>) {
    this._next = iterator.next.bind(iterator);
  }

  [Symbol.iterator](): IterableIterator<T> {
    return this;
  }

  filter(predicate: (item: T) => boolean): Sequence<T> {
    return this.rewrap(function* (this: Iterable<T>) {
      for (let val of this) {
        if (predicate(val))
          yield val;
      }
    });
  }

  map<U, S>(transform: (element: T) => S): Sequence<S> {
    return this.rewrap(
      function* (this: Iterable<T>) {
        for (let val of this) {
          yield transform(val);
        }
      }
    );
  }

  flatten() {
    return this.rewrap(function* (this: Iterable<T>) {
      for (let x of this) {
        if (typeof x !== "string" && isIterable(x)) {
          yield* x;
        } else {
          yield x;
        }
      }
    })
  }

  take(num: number = 1): Sequence<T> {
    return this.rewrap((
      function* (this: Iterable<T>) {
        let count = 0;
        for (let val of this) {
          if (count++ >= num) {
            break;
          }
          yield val;
        }
      }
    ));
  }


  toArray(): T[] {
    return [...this];
  }

  private rewrap<U>(fn: () => IterableIterator<U>): Sequence<U> {
    return new Sequence(fn.call(this));
  };
}

export function sequenceOf<T>(...args: T[]): Sequence<T> {
  return new Sequence(getIterator(args));
}