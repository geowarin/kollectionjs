import {getIterator, isIterable} from "./utils";

const TruePredicate = () => true;

export class Sequence<T> implements IterableIterator<T> {
  private readonly _next: () => IteratorResult<T>;

  public next(): IteratorResult<T> {
    return this._next();
  }

  constructor(iterator: Iterator<T>) {
    this._next = iterator.next.bind(iterator);
  }

  [Symbol.iterator](): IterableIterator<T> {
    return this;
  }

  all(this: Sequence<T>, predicate: (item: T) => boolean): boolean {
    for (let item of this) {
      if (!predicate(item)) {
        return false;
      }
    }
    return true;
  }

  any(this: Sequence<T>, predicate: (item: T) => boolean = TruePredicate): boolean {
    for (let item of this) {
      if (predicate(item)) {
        return true;
      }
    }
    return false;
  }

  lastOrNull(this: Sequence<T>, predicate: (value: T) => boolean = TruePredicate): T | null {
    let last = null;
    for (let item of this) {
      if (predicate(item)) {
        last = item;
      }
    }
    return last;
  }

  firstOrNull(this: Sequence<T>, predicate: (item: T) => boolean = TruePredicate): T | null {
    for (let item of this) {
      if (predicate(item)) {
        return item;
      }
    }
    return null;
  }

  contains<T>(this: Sequence<T>, element: T): boolean {
    for (let item of this) {
      if (element === item) {
        return true;
      }
    }
    return false;
  }

  forEach<T>(this: Sequence<T>, action: (item: T) => void) {
    for (let item of this) {
      action(item);
    }
  }

  forEachIndexed<T>(this: Sequence<T>, action: (index: number, value: T) => void) {
    let index = 0;
    for (let item of this) {
      action(index++, item);
    }
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

  filterIndexed(predicate: (index: number, item: T) => boolean): Sequence<T> {
    return this.rewrap(function* (this: Iterable<T>) {
      let index = 0;
      for (let item of this) {
        if (predicate(index++, item)) {
          yield item;
        }
      }
    });
  }

  filterNot(predicate: (value: T) => boolean): Sequence<T> {
    return this.filter((value: T) => !predicate(value));
  }

  filterNotNull(): Sequence<T> {
    return this.filter(it => it !== null);
  }

  find(predicate: (item: T) => boolean = TruePredicate): T | null {
    return this.firstOrNull(predicate);
  }

  findLast<T>(this: Sequence<T>, predicate: (value: T) => boolean = TruePredicate): T | null {
    return this.lastOrNull(predicate);
  }

  first(predicate: (item: T) => boolean = TruePredicate): T {
    for (let item of this) {
      if (predicate(item)) {
        return item;
      }
    }
    throw new Error("No such element");
  }

  map<U, S>(transform: (element: T) => S): Sequence<S> {
    return this.rewrap(function* (this: Iterable<T>) {
      for (let item of this) {
        yield transform(item);
      }
    });
  }

  mapIndexed<R>(transform: (index: number, value: T) => R): Sequence<R> {
    return this.rewrap(function* (this: Iterable<T>) {
      let index = 0;
      for (let item of this) {
        yield transform(index++, item);
      }
    });
  }

  mapNotNull<R>(transform: (value: T) => R | null): Sequence<R> {
    return this.flatMap((value: T) => {
      const item = transform(value);
      return item !== null
        ? sequenceOf(item)
        : emptySequence();
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

  flatMap<U>(transform: (value: T) => Iterable<U>): Sequence<U> {
    return this.rewrap(function* (this: Iterable<T>) {
      for (let item of this) {
        yield* transform(item);
      }
    });
  }

  fold<R>(initial: R, operation: (acc: R, element: T) => R): R {
    let result = initial;
    for (let item of this) {
      result = operation(result, item);
    }
    return result;
  }

  foldIndexed<R>(initial: R, operation: (index: number, acc: R, element: T) => R): R {
    let result = initial;
    let index = 0;
    for (let item of this) {
      result = operation(index, result, item);
      index++;
    }
    return result;
  }

  count(predicate: (item: T) => boolean = Boolean): number {
    let num = 0;
    for (let item of this) {
      if (predicate(item)) {
        num++;
      }
    }
    return num;
  }

  elementAt(index: number): T {
    return this.elementAtOrElse(index, () => {
      throw new Error("Index out of bounds: " + index)
    })
  }

  elementAtOrNull(index: number): T | null {
    return this.elementAtOrElse(index, () => null as any);
  }

  elementAtOrElse(index: number, defaultValue: (index: number) => T): T {
    let i = 0;
    for (let item of this) {
      if (i === index) {
        return item;
      }
      i++;
    }
    return defaultValue(index);
  }

  indexOf(element: T): number {
    let index = 0;
    for (let item of this) {
      if (item === element) {
        return index;
      }
      index++;
    }
    return -1;
  }

  indexOfFirst(predicate: (value: T) => boolean): number {
    let index = 0;
    for (let item of this) {
      if (predicate(item)) {
        return index;
      }
      index++;
    }
    return -1;
  }

  indexOfLast<T>(this: Sequence<T>, predicate: (value: T) => boolean): number {
    let index = 0;
    let result = -1;
    for (let item of this) {
      if (predicate(item)) {
        result = index;
      }
      index++;
    }
    return result;
  }

  last(predicate: (value: T) => boolean = TruePredicate): T {
    let last = null;
    let count = 0;
    for (let item of this) {
      count++;
      if (predicate(item)) {
        last = item;
      }
    }
    if (count == 0) {
      throw new Error("No such element");
    }
    return last as T;
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

  distinct(): Sequence<T> {
    return this.rewrap(function* (this: Iterable<T>) {
      const items: T[] = [];
      for (let item of this) {
        if (items.indexOf(item) < 0) {
          items.push(item);
          yield item;
        }
      }
    });
  }

  distinctBy<K>(selector: (item: T) => K): Sequence<T> {
    return this.rewrap(function* (this: Iterable<T>) {
      const keys: K[] = [];
      for (let item of this) {
        const key = selector(item);
        if (keys.indexOf(key) < 0) {
          keys.push(key);
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

  max<T>(this: Sequence<T>): T | null {
    let result: T | null = null;
    for (let item of this) {
      if (result == null || item > result) {
        result = item;
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

  associate<K, V>(transform: (value: T) => [K, V]): Map<K, V> {
    const result = new Map<K, V>();
    for (let item of this) {
      const pair = transform(item);
      result.set(pair[0], pair[1]);
    }
    return result;
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

  chunk(chunkSize: number): T[][] {
    if (chunkSize < 1) {
      throw new Error("chunkSize must be > 0 but is " + chunkSize);
    }
    const result: T[][] = [];
    let index = 0;
    for (let item of this) {
      const chunkIndex = Math.floor(index / chunkSize);
      if (result[chunkIndex] == null) {
        result[chunkIndex] = [item];
      } else {
        result[chunkIndex].push(item);
      }
      index++;
    }
    return result;
  }

  average(this: Sequence<number>): number {
    let sum = 0;
    let count = 0;
    for (let item of this) {
      sum += item;
      count++;
    }
    return count === 0
      ? Number.NaN
      : sum / count;
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

export function asSequence<T>(iterable: Iterable<T>): Sequence<T> {
  return new Sequence(getIterator(iterable));
}