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

  all(predicate: (value: T) => boolean): boolean {
    return this.every(predicate);
  }

  any(predicate: (value: T) => boolean = TruePredicate): boolean {
    return this.some(predicate);
  }

  none(predicate: (value: T) => boolean = TruePredicate): boolean {
    return !this.some(predicate);
  }

  isEmpty(): boolean {
    return this.none();
  }

  isNotEmpty(): boolean {
    return this.any();
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

  firstOrNull(predicate: (value: T) => boolean = TruePredicate): T | undefined {
    for (let item of this) {
      if (predicate(item)) return item;
    }
    return undefined;
  }

  contains(element: T): boolean {
    return this.some((item) => item === element);
  }

  withIndex(): Sequence<{ index: number; value: T }> {
    return this.pipe(function* (this: Iterable<T>) {
      let index = 0;
      for (const value of this) {
        yield { index: index++, value };
      }
    }) as Sequence<{ index: number; value: T }>;
  }

  onEach(action: (value: T) => void): Sequence<T> {
    return this.pipe(function* (this: Iterable<T>) {
      for (let item of this) {
        action(item);
        yield item;
      }
    });
  }

  filter(predicate: (value: T, index: number) => boolean): Sequence<T> {
    return new Sequence(super.filter(predicate));
  }

  filterNot(predicate: (value: T) => boolean): Sequence<T> {
    return this.filter((value: T) => !predicate(value));
  }

  filterNotNull(): Sequence<NonNullable<T>> {
    return new Sequence(super.filter((it): it is NonNullable<T> => it != null));
  }

  // Override to add a default predicate (native Iterator.find requires one).
  find(predicate: (value: T, index: number) => unknown = TruePredicate): T | undefined {
    let index = 0;
    for (const item of this) {
      if (predicate(item, index++)) return item;
    }
    return undefined;
  }

  findLast(predicate: (value: T) => boolean = TruePredicate): T | undefined {
    return this.lastOrNull(predicate);
  }

  first(predicate: (value: T) => boolean = TruePredicate): T {
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
          throw new Error("More than one element");
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

  map<S>(transform: (value: T, index: number) => S): Sequence<S> {
    return new Sequence(super.map(transform));
  }

  mapNotNull<R>(transform: (value: T) => R | null | undefined): Sequence<R> {
    return new Sequence(super.map(transform).filter((x): x is R => x != null));
  }

  flatten<U>(this: Sequence<Iterable<U>>): Sequence<U> {
    return this.pipe(function* (this: Iterable<Iterable<U>>) {
      for (const item of this) {
        yield* item;
      }
    }) as Sequence<U>;
  }

  flatMap<U>(transform: (value: T, index: number) => Iterable<U>): Sequence<U> {
    return new Sequence(super.flatMap(transform));
  }

  fold<R>(initial: R, operation: (acc: R, value: T) => R): R {
    return this.reduce(operation, initial);
  }

  foldIndexed<R>(initial: R, operation: (acc: R, value: T, index: number) => R): R {
    let result = initial;
    let index = 0;
    for (let item of this) {
      result = operation(result, item, index);
      index++;
    }
    return result;
  }

  scan<R>(initial: R, operation: (acc: R, value: T) => R): Sequence<R> {
    return this.pipe(function* (this: Iterable<T>) {
      let acc = initial;
      yield acc;
      for (const item of this) {
        acc = operation(acc, item);
        yield acc;
      }
    }) as Sequence<R>;
  }

  runningFold<R>(initial: R, operation: (acc: R, value: T) => R): Sequence<R> {
    return this.scan(initial, operation);
  }

  reduceIndexed(operation: (acc: T, value: T, index: number) => T): T {
    let result: T = this.first();
    let index = 1;
    for (let item of this) {
      result = operation(result, item, index++);
    }
    return result;
  }

  count(predicate: (value: T) => boolean = TruePredicate): number {
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

  takeWhile(predicate: (value: T) => boolean): Sequence<T> {
    return this.pipe(function* (this: Iterable<T>) {
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

  dropWhile(predicate: (value: T) => boolean): Sequence<T> {
    return this.pipe(function* (this: Iterable<T>) {
      let dropping = true;
      for (const item of this) {
        if (dropping && predicate(item)) continue;
        dropping = false;
        yield item;
      }
    });
  }

  distinct(): Sequence<T> {
    return this.pipe(function* (this: Iterable<T>) {
      const seen = new Set<T>();
      for (let item of this) {
        if (!seen.has(item)) {
          seen.add(item);
          yield item;
        }
      }
    });
  }

  distinctBy<K>(selector: (value: T) => K): Sequence<T> {
    return this.pipe(function* (this: Iterable<T>) {
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

  groupBy<K>(keySelector: (value: T) => K): Map<K, T[]>;
  groupBy<K, V>(keySelector: (value: T) => K, valueTransform: (value: T) => V): Map<K, V[]>;
  groupBy<K, V>(keySelector: (value: T) => K, valueTransform?: (value: T) => V): Map<K, (T | V)[]> {
    const result = new Map<K, (T | V)[]>();
    for (const item of this) {
      const key = keySelector(item);
      const value = valueTransform ? valueTransform(item) : item;
      const array = result.get(key);
      if (array == null) {
        result.set(key, [value]);
      } else {
        array.push(value);
      }
    }
    return result;
  }

  max(): T | undefined {
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
    return this.pipe(function* (this: Iterable<T>) {
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

  associateWith<V>(valueSelector: (value: T) => V): Map<T, V> {
    const result = new Map<T, V>();
    for (const item of this) {
      result.set(item, valueSelector(item));
    }
    return result;
  }

  windowed(size: number, step: number = 1, partialWindows: boolean = false): Sequence<T[]> {
    if (size < 1) throw new Error("size must be > 0 but is " + size);
    if (step < 1) throw new Error("step must be > 0 but is " + step);
    const arr = this.toArray();
    return new Sequence(
      (function* () {
        for (let i = 0; i < arr.length; i += step) {
          const window = arr.slice(i, i + size);
          if (window.length === size || partialWindows) {
            yield window;
          }
        }
      })(),
    );
  }

  chunk(chunkSize: number): Sequence<T[]> {
    if (chunkSize < 1) {
      throw new Error("chunkSize must be > 0 but is " + chunkSize);
    }
    return this.pipe(function* (this: Iterable<T>) {
      let chunk: T[] = [];
      for (const item of this) {
        chunk.push(item);
        if (chunk.length === chunkSize) {
          yield chunk;
          chunk = [];
        }
      }
      if (chunk.length > 0) yield chunk;
    }) as Sequence<T[]>;
  }

  partition(predicate: (value: T) => boolean): [T[], T[]] {
    const arrayTrue: T[] = [];
    const arrayFalse: T[] = [];
    for (let item of this) {
      if (predicate(item)) {
        arrayTrue.push(item);
      } else {
        arrayFalse.push(item);
      }
    }
    return [arrayTrue, arrayFalse];
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

  joinToString(options?: {
    separator?: string;
    prefix?: string;
    postfix?: string;
    transform?: (value: T) => string;
  }): string {
    const { separator = ", ", prefix = "", postfix = "", transform } = options ?? {};
    const parts: string[] = [];
    for (const item of this) {
      parts.push(transform ? transform(item) : String(item));
    }
    return prefix + parts.join(separator) + postfix;
  }

  zip<S>(other: Iterable<S>): Sequence<[T, S]>;
  zip<S, R>(other: Iterable<S>, transform: (a: T, b: S) => R): Sequence<R>;
  zip<S, R>(other: Iterable<S>, transform?: (a: T, b: S) => R): Sequence<[T, S]> | Sequence<R> {
    const otherIterator: Iterator<S> = getIterator(other);
    const thisIterator: Iterator<T> = this;
    const fn = transform ?? ((a: T, b: S): [T, S] => [a, b]);
    return this.pipe(function* () {
      while (true) {
        const otherNext = otherIterator.next();
        const thisNext = thisIterator.next();
        if (otherNext.done || thisNext.done) return;
        yield (fn as (a: T, b: S) => [T, S] | R)(thisNext.value, otherNext.value);
      }
    }) as Sequence<[T, S]> | Sequence<R>;
  }

  unzip<A, B>(this: Sequence<[A, B]>): [A[], B[]] {
    const array1: A[] = [];
    const array2: B[] = [];
    for (let [first, second] of this) {
      array1.push(first);
      array2.push(second);
    }
    return [array1, array2];
  }

  zipWithNext(): Sequence<[T, T]>;
  zipWithNext<R>(transform: (a: T, b: T) => R): Sequence<R>;
  zipWithNext<R>(transform?: (a: T, b: T) => R): Sequence<[T, T]> | Sequence<R> {
    if (transform) {
      return this.pipe(function* (this: Iterable<T>) {
        let prev: T | undefined = undefined;
        let hasPrev = false;
        for (const item of this) {
          if (hasPrev) yield transform(prev as T, item);
          prev = item;
          hasPrev = true;
        }
      }) as Sequence<R>;
    }
    return this.pipe(function* (this: Iterable<T>) {
      let prev: T | undefined = undefined;
      let hasPrev = false;
      for (const item of this) {
        if (hasPrev) yield [prev, item] as [T, T];
        prev = item;
        hasPrev = true;
      }
    }) as Sequence<[T, T]>;
  }

  sorted(): Sequence<T> {
    return asSequence(this.toArray().sort((a, b) => (a < b ? -1 : a > b ? 1 : 0)));
  }

  sortedBy<R>(selector: (value: T) => R): Sequence<T> {
    return asSequence(
      this.toArray().sort((a, b) => {
        const ka = selector(a);
        const kb = selector(b);
        return ka < kb ? -1 : ka > kb ? 1 : 0;
      }),
    );
  }

  sortedWith(comparator: (a: T, b: T) => number): Sequence<T> {
    return asSequence(this.toArray().sort(comparator));
  }

  sortedDescending(): Sequence<T> {
    return asSequence(this.toArray().sort((a, b) => (a < b ? 1 : a > b ? -1 : 0)));
  }

  sortedByDescending<R>(selector: (value: T) => R): Sequence<T> {
    return asSequence(
      this.toArray().sort((a, b) => {
        const ka = selector(a);
        const kb = selector(b);
        return ka < kb ? 1 : ka > kb ? -1 : 0;
      }),
    );
  }

  reverse(): Sequence<T> {
    return asSequence(this.toArray().reverse());
  }

  toSet(set?: Set<T>): Set<T> {
    const result = set || new Set<T>();
    for (let item of this) {
      result.add(item);
    }
    return result;
  }

  toMap<K, V>(this: Sequence<[K, V]>): Map<K, V> {
    const result = new Map<K, V>();
    for (const [key, value] of this) {
      result.set(key, value);
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

export function concat<T>(...iterables: Iterable<T>[]): Sequence<T> {
  return new Sequence(
    (function* () {
      for (const iterable of iterables) {
        yield* iterable;
      }
    })(),
  );
}

export function range(start: number, endExclusive: number, step: number = 1): Sequence<number> {
  if (step === 0) throw new Error("step must not be zero");
  return new Sequence(
    (function* () {
      if (step > 0) {
        for (let i = start; i < endExclusive; i += step) yield i;
      } else {
        for (let i = start; i > endExclusive; i += step) yield i;
      }
    })(),
  );
}

export function generate<T>(seed: T, next: (value: T) => T | null | undefined): Sequence<T> {
  return new Sequence(
    (function* () {
      let current: T | null | undefined = seed;
      while (current != null) {
        yield current;
        current = next(current);
      }
    })(),
  );
}
