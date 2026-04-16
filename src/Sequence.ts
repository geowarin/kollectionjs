import { getIterator, isIterable } from "./utils";

const TruePredicate = () => true;

export class Sequence<T> extends Iterator<T> {
  private readonly _next: () => IteratorResult<T>;

  public next(): IteratorResult<T> {
    return this._next();
  }

  constructor(iterator: Iterator<T>) {
    super();
    this._next = iterator.next.bind(iterator);
  }

  all(predicate: (item: T) => boolean): boolean {
    return this.every(predicate);
  }

  any(predicate: (item: T) => boolean = TruePredicate): boolean {
    return this.some(predicate);
  }

  none<T>(this: Sequence<T>, predicate: (value: T) => boolean = TruePredicate): boolean {
    return !this.some(predicate);
  }

  lastOrNull(predicate: (value: T) => boolean = TruePredicate): T | undefined {
    let last: T | undefined = undefined;
    for (let item of this) {
      if (predicate(item)) {
        last = item;
      }
    }
    return last;
  }

  firstOrNull(predicate: (item: T) => boolean = TruePredicate): T | undefined {
    for (let item of this) {
      if (predicate(item)) return item;
    }
    return undefined;
  }

  contains(element: T): boolean {
    return this.some((item) => item === element);
  }

  onEach(action: (item: T) => void): Sequence<T> {
    return this.pipe(function* (this: Iterable<T>) {
      for (let item of this) {
        action(item);
        yield item;
      }
    });
  }

  forEachIndexed(action: (index: number, value: T) => void) {
    let index = 0;
    for (let item of this) {
      action(index++, item);
    }
  }

  filter(predicate: (item: T, index: number) => boolean): Sequence<T> {
    return new Sequence(super.filter(predicate));
  }

  filterNot(predicate: (value: T) => boolean): Sequence<T> {
    return this.filter((value: T) => !predicate(value));
  }

  filterNotNull(): Sequence<T> {
    return this.filter((it) => it !== null);
  }

  // Override to add a default predicate (native Iterator.find requires one).
  find(predicate: (item: T, index: number) => unknown = TruePredicate): T | undefined {
    return this.firstOrNull(predicate as (item: T) => boolean);
  }

  findLast(predicate: (value: T) => boolean = TruePredicate): T | undefined {
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
    let result: T | undefined = undefined;
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

  singleOrNull(predicate: (value: T) => boolean = TruePredicate): T | undefined {
    let result: T | undefined = undefined;
    let count = 0;
    for (let item of this) {
      if (predicate(item)) {
        result = item;
        count++;
        if (count > 1) return undefined;
      }
    }
    return result;
  }

  map<S>(transform: (element: T, index: number) => S): Sequence<S> {
    return new Sequence(super.map(transform));
  }

  mapNotNull<R>(transform: (value: T) => R | null | undefined): Sequence<R> {
    return new Sequence(super.map(transform).filter((x): x is R => x != null));
  }

  flatten() {
    return this.pipe(function* (this: Iterable<T>) {
      for (let item of this) {
        if (typeof item !== "string" && isIterable(item)) {
          yield* item;
        } else {
          yield item;
        }
      }
    });
  }

  flatMap<U>(transform: (value: T, index: number) => Iterable<U>): Sequence<U> {
    return new Sequence(super.flatMap(transform));
  }

  fold<R>(initial: R, operation: (acc: R, element: T) => R): R {
    return this.reduce(operation, initial);
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

  reduceIndexed(operation: (index: number, acc: T, element: T) => T): T {
    let result: T = this.first();
    let index = 1;
    for (let item of this) {
      result = operation(index++, result, item);
    }
    return result;
  }

  count(predicate: (item: T) => boolean = TruePredicate): number {
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
      throw new Error("Index out of bounds: " + index);
    });
  }

  elementAtOrNull(index: number): T | undefined {
    let i = 0;
    for (let item of this) {
      if (i === index) return item;
      i++;
    }
    return undefined;
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
    let last: T | undefined = undefined;
    let found = false;
    for (let item of this) {
      if (predicate(item)) {
        last = item;
        found = true;
      }
    }
    if (!found) {
      throw new Error("No such element");
    }
    return last as T;
  }

  take(num: number = 1): Sequence<T> {
    return new Sequence(super.take(Math.max(0, num)));
  }

  takeWhile(predicate: (item: T) => boolean): Sequence<T> {
    return this.pipe(function* () {
      for (let item of this) {
        if (!predicate(item)) {
          break;
        }
        yield item;
      }
    });
  }

  drop(num: number = 1): Sequence<T> {
    return new Sequence(super.drop(Math.max(0, num)));
  }

  distinct(): Sequence<T> {
    return this.pipe(function* () {
      const seen = new Set<T>();
      for (let item of this) {
        if (!seen.has(item)) {
          seen.add(item);
          yield item;
        }
      }
    });
  }

  distinctBy<K>(selector: (item: T) => K): Sequence<T> {
    return this.pipe(function* () {
      const seen = new Set<K>();
      for (let item of this) {
        const key = selector(item);
        if (!seen.has(key)) {
          seen.add(key);
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

  max<T>(this: Sequence<T>): T | undefined {
    let result: T | undefined = undefined;
    for (let item of this) {
      if (result == null || item > result) {
        result = item;
      }
    }
    return result;
  }

  maxBy<R>(selector: (value: T) => R): T | undefined {
    let max: T | undefined = undefined;
    let maxSelected: R | undefined = undefined;
    for (let item of this) {
      const value = selector(item);
      if (maxSelected == null || value > maxSelected) {
        maxSelected = value;
        max = item;
      }
    }
    return max;
  }

  maxWith(compare: (a: T, b: T) => number): T | undefined {
    let max: T | undefined = undefined;
    for (let item of this) {
      if (max === undefined || compare(item, max) > 0) {
        max = item;
      }
    }
    return max;
  }

  min(): T | undefined {
    let result: T | undefined = undefined;
    for (let item of this) {
      if (result == null || item < result) {
        result = item;
      }
    }
    return result;
  }

  minBy<R>(selector: (value: T) => R): T | undefined {
    let min: T | undefined = undefined;
    let minSelected: R | undefined = undefined;
    for (let item of this) {
      const value = selector(item);
      if (minSelected == null || value < minSelected) {
        minSelected = value;
        min = item;
      }
    }
    return min;
  }

  minWith(compare: (a: T, b: T) => number): T | undefined {
    let min: T | undefined = undefined;
    for (let item of this) {
      if (min === undefined || compare(item, min) < 0) {
        min = item;
      }
    }
    return min;
  }

  minus(data: T | Iterable<T>): Sequence<T> {
    if (isIterable(data)) {
      const exclusions = new Set<T>(data);
      return this.filter((it) => !exclusions.has(it));
    } else {
      return this.filter((it) => it !== data);
    }
  }

  plus(element: T): Sequence<T>;
  plus(other: Iterable<T>): Sequence<T>;
  plus(data: T | Iterable<T>): Sequence<T> {
    const other = isIterable(data) ? data : [data];
    return this.pipe(function* () {
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
  associateBy<K, V>(keyOrSelector: any, valueTransform?: (value: T) => V): Map<K, V | T> {
    const selector =
      typeof keyOrSelector === "function"
        ? keyOrSelector
        : (value: T) => value[keyOrSelector as keyof T];
    const result = new Map<K, V | T>();
    const transform = valueTransform != null ? valueTransform : (value: T) => value;
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
    let posInChunk = 0;
    for (let item of this) {
      if (posInChunk === 0) {
        result.push([item]);
      } else {
        result[result.length - 1].push(item);
      }
      if (++posInChunk === chunkSize) posInChunk = 0;
    }
    return result;
  }

  partition(predicate: (value: T) => boolean): { true: T[]; false: T[] } {
    const arrayTrue: T[] = [];
    const arrayFalse: T[] = [];
    for (let item of this) {
      if (predicate(item)) {
        arrayTrue.push(item);
      } else {
        arrayFalse.push(item);
      }
    }
    return { true: arrayTrue, false: arrayFalse };
  }

  average(this: Sequence<number>): number {
    let sum = 0;
    let count = 0;
    for (let item of this) {
      sum += item;
      count++;
    }
    return count === 0 ? Number.NaN : sum / count;
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
    return this.pipe(function* () {
      while (true) {
        let otherNext = otherIterator.next();
        let thisNext = thisIterator.next();
        if (otherNext.done || thisNext.done) {
          return;
        }
        yield [thisNext.value, otherNext.value] as [T, S];
      }
    });
  }

  unzip<T, S>(this: Sequence<[T, S]>): [T[], S[]] {
    const array1: T[] = [];
    const array2: S[] = [];
    for (let [first, second] of this) {
      array1.push(first);
      array2.push(second);
    }
    return [array1, array2];
  }

  reverse(): Sequence<T> {
    return asSequence(this.toArray().reverse());
  }

  toSet<T>(this: Sequence<T>, set?: Set<T>): Set<T> {
    const result = set || new Set<T>();
    for (let item of this) {
      result.add(item);
    }
    return result;
  }

  private pipe<U>(fn: (this: Iterable<T>) => IterableIterator<U>): Sequence<U> {
    return new Sequence(fn.call(this));
  }
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
