import {contains, getIterator, isIterable} from "./utils";

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

  all(predicate: (item: T) => boolean): boolean {
    for (let item of this) {
      if (!predicate(item)) {
        return false;
      }
    }
    return true;
  }

  any(predicate: (item: T) => boolean = TruePredicate): boolean {
    for (let item of this) {
      if (predicate(item)) {
        return true;
      }
    }
    return false;
  }

  none<T>(this: Sequence<T>, predicate: (value: T) => boolean = TruePredicate): boolean {
    for (let item of this) {
      if (predicate(item)) {
        return false;
      }
    }
    return true;
  }

  lastOrNull(predicate: (value: T) => boolean = TruePredicate): T | null {
    let last = null;
    for (let item of this) {
      if (predicate(item)) {
        last = item;
      }
    }
    return last;
  }

  firstOrNull(predicate: (item: T) => boolean = TruePredicate): T | null {
    for (let item of this) {
      if (predicate(item)) {
        return item;
      }
    }
    return null;
  }

  contains(element: T): boolean {
    for (let item of this) {
      if (element === item) {
        return true;
      }
    }
    return false;
  }

  forEach(action: (item: T) => void) {
    for (let item of this) {
      action(item);
    }
  }

  onEach(action: (item: T) => void): Sequence<T> {
    return this.rewrap(function* (this: Iterable<T>) {
      for (let item of this) {
        action(item);
        yield item;
      }
    })
  }

  forEachIndexed(action: (index: number, value: T) => void) {
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

  findLast(predicate: (value: T) => boolean = TruePredicate): T | null {
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

  single(predicate: (value: T) => boolean = TruePredicate): T {
    let result = null;
    let count = 0;
    for (let item of this) {
      if (predicate(item)) {
        result = item;
        count++;
        if (count > 1) {
          throw new Error("Expect single element");
        }
      }
    }
    if (count == 0) {
      throw new Error("No such element");
    }
    return result as T;
  }

  singleOrNull(predicate: (value: T) => boolean = TruePredicate): T | null {
    let result = null;
    let count = 0;
    for (let item of this) {
      if (predicate(item)) {
        result = item;
        count++;
      }
    }
    if (count > 1) {
      return null;
    }
    return result;
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

  reduce(operation: (acc: T, value: T) => T): T {
    let result: T = this.first();
    for (let item of this) {
      result = operation(result, item);
    }
    return result;
  }

  reduceIndexed(operation: (index: number, acc: T, element: T) => T): T {
    let result: T = this.first();
    let index = 1;
    for (let item of this) {
      result = operation(index++, result, item);
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

  indexOfLast(predicate: (value: T) => boolean): number {
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

  takeWhile(predicate: (item: T) => boolean): Sequence<T> {
    return this.rewrap(function* (this: Iterable<T>) {
      for (let item of this) {
        if (!predicate(item)) {
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

  maxWith(compare: (a: T, b: T) => number): T | null {
    let max: T | null = null;
    for (let item of this) {
      if (max == null || compare(item, max) > 0) {
        max = item;
      }
    }
    return max;
  }

  min(): T | null {
    let result: T | null = null;
    for (let item of this) {
      if (result == null || item < result) {
        result = item;
      }
    }
    return result;
  }

  minBy<R>(selector: (value: T) => R): T | null {
    let min: T | null = null;
    let minSelected: R | null = null;
    for (let item of this) {
      const value = selector(item);
      if (minSelected == null || value < minSelected) {
        minSelected = value;
        min = item;
      }
    }
    return min;
  }

  minWith(compare: (a: T, b: T) => number): T | null {
    let min: T | null = null;
    for (let item of this) {
      if (min == null || compare(item, min) < 0) {
        min = item;
      }
    }
    return min;
  }

  minus(data: T | Iterable<T>): Sequence<T> {
    if (isIterable(data)) {
      return this.filter(it => !contains(data, it));
    } else {
      return this.filter(it => it !== data);
    }
  }

  plus(element: T): Sequence<T>;
  plus(other: Iterable<T>): Sequence<T>;
  plus(data: T | Iterable<T>): Sequence<T> {
    const other = isIterable(data) ? data : [data];
    return this.rewrap(function* (this: Iterable<T>) {
      for (let item of this) {
        yield item;
      }
      for (let item of other) {
        yield item;
      }
    });
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

  partition(predicate: (value: T) => boolean): { "true": T[], "false": T[] } {
    const arrayTrue: T[] = [];
    const arrayFalse: T[] = [];
    for (let item of this) {
      if (predicate(item)) {
        arrayTrue.push(item);
      } else {
        arrayFalse.push(item);
      }
    }
    return {"true": arrayTrue, "false": arrayFalse};
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

  sum(this: Sequence<number>): number {
    let result = 0;
    for (let item of this) {
      result += item;
    }
    return result;
  }

  sumBy(selector: (value: T) => number): number {
    let result = 0;
    for (let item of this) {
      result += selector(item);
    }
    return result;
  }

  zip<S>(other: Iterable<S>): Sequence<[T, S]> {
    const otherIterator: Iterator<S> = getIterator(other);
    const thisIterator: Iterator<T> = this;
    return this.rewrap(function* (this: Iterable<T>) {
      while (true) {
        let otherNext = otherIterator.next();
        let thisNext = thisIterator.next();
        if (otherNext.done || thisNext.done) {
          return;
        }
        yield ([thisNext.value, otherNext.value] as [T, S]);
      }
    });
  }

  reverse(): Sequence<T> {
    return asSequence(this.toArray().reverse());
  }

  toArray(): T[] {
    return [...this];
  }

  toSet<T>(this: Sequence<T>, set?: Set<T>): Set<T> {
    const result = set || new Set();
    for (let item of this) {
      result.add(item);
    }
    return result;
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