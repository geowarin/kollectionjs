import {getIterator, isIterable} from "./utils";

export class Sequence<T> implements IterableIterator<T> {
  private readonly _next: () => IteratorResult<T>;

  public next(): IteratorResult<T> {
    return this._next()
  }

  constructor(iterator: Iterator<T>) {
    this._next = iterator.next.bind(iterator);
  }

  [Symbol.iterator](): IterableIterator<T> {
    return this;
  }

  filter(predicate: (item: T) => boolean): Sequence<T> {
    return this.rewrap(function* (this: Iterable<T>) {
      for (let item of this) {
        if (predicate(item)) {
          yield item;
        }
      }
    });
  }

  map<U, S>(transform: (element: T) => S): Sequence<S> {
    return this.rewrap(function* (this: Iterable<T>) {
      for (let item of this) {
        yield transform(item);
      }
    });
  }

  flatten() {
    return this.rewrap(function* (this: Iterable<T>) {
      for (let item of this) {
        if (typeof item !== "string" && isIterable(item)) {
          yield* item;
        } else {
          yield item;
        }
      }
    });
  }

  take(num: number = 1): Sequence<T> {
    return this.rewrap(function* (this: Iterable<T>) {
      let count = 0;
      for (let item of this) {
        if (count++ >= num) {
          break;
        }
        yield item;
      }
    });
  }

  drop(num: number = 1): Sequence<T> {
    return this.rewrap(function* (this: Iterable<T>) {
      let count = 0;
      for (let item of this) {
        if (count++ >= num) {
          yield item;
        }
      }
    });
  }

  groupBy<K>(keySelector: (value: T) => K): Map<K, T[]> {
    const result = new Map<K, T[]>();
    for (let item of this) {
      const key = keySelector(item);
      const array = result.get(key);
      if (array == null) {
        result.set(key, [item]);
      } else {
        array.push(item);
      }
    }
    return result;
  }

  maxBy<R>(selector: (value: T) => R): T | null {
    let max: T | null = null;
    let maxSelected: R | null = null;
    for (let item of this) {
      const value = selector(item);
      if (maxSelected == null || value > maxSelected) {
        maxSelected = value;
        max = item;
      }
    }
    return max;
  }

  associateBy<K>(keySelector: (value: T) => K): Map<K, T>;
  associateBy<K extends keyof T>(key: K): Map<T[K], T>;
  associateBy<K, V>(keySelector: (value: T) => K, valueTransformer: (value: T) => V): Map<K, V>;
  associateBy<K extends keyof T, V>(key: K, valueTransformer: (value: T) => V): Map<T[K], V>;
  associateBy<K, V>(keyOrSelector: any,
                    valueTransform?: (value: T) => V): Map<K, V | T> {
    const selector = typeof keyOrSelector === "function"
      ? keyOrSelector
      : (value: T) => value[keyOrSelector as keyof T];
    const result = new Map<K, V | T>();
    const transform = valueTransform != null
      ? valueTransform
      : (value: T) => value;
    for (let item of this) {
      const key = selector(item);
      const value = transform(item);
      result.set(key, value);
    }
    return result;
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

export function emptySequence<T>(): Sequence<T> {
  return sequenceOf();
}