import { getIterator, isIterable } from "./utils";

const TruePredicate = () => true;

/**
 * A lazy sequence of elements that wraps a native `Iterator<T>`.
 *
 * Operations on a `Sequence` are evaluated lazily — intermediate operations
 * (e.g. `filter`, `map`) build up a pipeline and produce no results until a
 * terminal operation (e.g. `toArray`, `fold`, `count`) consumes the iterator.
 *
 * @example
 * ```ts
 * asSequence([1, 2, 3, 4, 5])
 *   .filter(n => n % 2 === 0)
 *   .map(n => n * 10)
 *   .toArray(); // [20, 40]
 * ```
 *
 * @typeParam T - The element type.
 */
export class Sequence<T> extends Iterator<T> {
  private readonly _next: () => IteratorResult<T>;

  public next(): IteratorResult<T> {
    return this._next();
  }

  /**
   * Creates a `Sequence` wrapping the given `Iterator`.
   * @param iterator - The underlying iterator to wrap.
   */
  constructor(iterator: Iterator<T>) {
    super();
    this._next = iterator.next.bind(iterator);
  }

  /**
   * Returns `true` if **any** element satisfies the predicate.
   * When called with no argument, returns `true` if the sequence is non-empty.
   * @param predicate - Test applied to each element. Defaults to always-true.
   */
  some(predicate: (value: T, index: number) => unknown = TruePredicate): boolean {
    let index = 0;
    for (const item of this) {
      if (predicate(item, index++)) return true;
    }
    return false;
  }

  /**
   * Returns `true` if **no** element satisfies the predicate.
   * When called with no argument, returns `true` if the sequence is empty.
   * @param predicate - Test applied to each element. Defaults to always-true.
   */
  none(predicate: (value: T) => boolean = TruePredicate): boolean {
    return !this.some(predicate);
  }

  /**
   * Returns `true` if the sequence contains no elements.
   */
  isEmpty(): boolean {
    return this.none();
  }

  /**
   * Returns `true` if the sequence contains at least one element.
   */
  isNotEmpty(): boolean {
    return this.some();
  }

  /**
   * Returns the last element matching the predicate, or `undefined` if none match.
   * When called with no argument, returns the last element or `undefined` for an empty sequence.
   * @param predicate - Test applied to each element. Defaults to always-true.
   */
  last(predicate: (value: T) => boolean = TruePredicate): T | undefined {
    let last: T | undefined = undefined;
    for (let item of this) {
      if (predicate(item)) {
        last = item;
      }
    }
    return last;
  }

  /**
   * Returns the first element matching the predicate, or `undefined` if none match.
   * When called with no argument, returns the first element or `undefined` for an empty sequence.
   * @param predicate - Test applied to each element. Defaults to always-true.
   */
  first(predicate: (value: T) => boolean = TruePredicate): T | undefined {
    for (let item of this) {
      if (predicate(item)) return item;
    }
    return undefined;
  }

  /**
   * Returns `true` if the sequence contains the given element (using `===`).
   * @param element - The value to search for.
   */
  contains(element: T): boolean {
    return this.some((item) => item === element);
  }

  /**
   * Returns a sequence of `{ index, value }` pairs, where `index` is the
   * zero-based position of each element.
   *
   * @example
   * ```ts
   * sequenceOf('a', 'b', 'c').withIndex().toArray();
   * // [{ index: 0, value: 'a' }, { index: 1, value: 'b' }, { index: 2, value: 'c' }]
   * ```
   */
  withIndex(): Sequence<{ index: number; value: T }> {
    return this.pipe(function* (this: Iterable<T>) {
      let index = 0;
      for (const value of this) {
        yield { index: index++, value };
      }
    }) as Sequence<{ index: number; value: T }>;
  }

  /**
   * Performs the given `action` on each element and returns the same sequence unchanged.
   * Useful for side-effects (e.g. logging) inside a pipeline.
   * @param action - Called with each element.
   */
  onEach(action: (value: T) => void): Sequence<T> {
    return this.pipe(function* (this: Iterable<T>) {
      for (let item of this) {
        action(item);
        yield item;
      }
    });
  }

  /**
   * Returns a sequence containing only the elements that satisfy the predicate.
   * @param predicate - Called with `(value, index)` for each element.
   */
  filter(predicate: (value: T, index: number) => boolean): Sequence<T> {
    return new Sequence(super.filter(predicate));
  }

  /**
   * Returns a sequence containing only the elements that do **not** satisfy the predicate.
   * @param predicate - Called with each element.
   */
  filterNot(predicate: (value: T) => boolean): Sequence<T> {
    return this.filter((value: T) => !predicate(value));
  }

  /**
   * Returns a sequence with all `null` and `undefined` elements removed.
   * The return type is narrowed to `Sequence<NonNullable<T>>`.
   */
  filterNotNull(): Sequence<NonNullable<T>> {
    return new Sequence(super.filter((it): it is NonNullable<T> => it != null));
  }

  /**
   * Returns the first element matching the predicate, or `undefined` if none match.
   * When called with no argument, returns the first element or `undefined` for an empty sequence.
   * @param predicate - Called with `(value, index)` for each element. Defaults to always-true.
   */
  find(predicate: (value: T, index: number) => unknown = TruePredicate): T | undefined {
    let index = 0;
    for (const item of this) {
      if (predicate(item, index++)) return item;
    }
    return undefined;
  }

  /**
   * Returns the single element matching the predicate, or `undefined` if there is
   * no match or more than one match.
   * @param predicate - Called with each element. Defaults to always-true.
   */
  single(predicate: (value: T) => boolean = TruePredicate): T | undefined {
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

  /**
   * Returns a sequence where each element is transformed by `transform`.
   * @param transform - Called with `(value, index)` for each element.
   * @typeParam S - The type of the transformed elements.
   */
  map<S>(transform: (value: T, index: number) => S): Sequence<S> {
    return new Sequence(super.map(transform));
  }

  /**
   * Returns a sequence of transformed elements, skipping any `null` or `undefined` results.
   * @param transform - Called with each element; results of `null`/`undefined` are excluded.
   * @typeParam R - The non-nullable return type of `transform`.
   */
  mapNotNull<R>(transform: (value: T) => R | null | undefined): Sequence<R> {
    return new Sequence(super.map(transform).filter((x): x is R => x != null));
  }

  /**
   * Flattens a sequence of iterables into a single sequence.
   *
   * @example
   * ```ts
   * sequenceOf([1, 2], [3, 4]).flatten().toArray(); // [1, 2, 3, 4]
   * ```
   *
   * @typeParam U - The element type of the nested iterables.
   */
  flatten<U>(this: Sequence<Iterable<U>>): Sequence<U> {
    return this.pipe(function* (this: Iterable<Iterable<U>>) {
      for (const item of this) {
        yield* item;
      }
    }) as Sequence<U>;
  }

  /**
   * Maps each element to an iterable and flattens the results into a single sequence.
   * @param transform - Called with `(value, index)`; must return an `Iterable`.
   * @typeParam U - The element type of the produced iterables.
   */
  flatMap<U>(transform: (value: T, index: number) => Iterable<U>): Sequence<U> {
    return new Sequence(super.flatMap(transform));
  }

  /**
   * Accumulates a value by applying `operation` left-to-right, starting from `initial`.
   * @param initial - The starting accumulator value.
   * @param operation - Called with `(accumulator, value)` for each element.
   * @typeParam R - The accumulator type.
   */
  fold<R>(initial: R, operation: (acc: R, value: T, index: number) => R): R {
    let result = initial;
    let index = 0;
    for (const item of this) {
      result = operation(result, item, index++);
    }
    return result;
  }

  /**
   * Returns a sequence of running accumulator values, starting with `initial`.
   * The first element of the returned sequence is always `initial`.
   *
   * @example
   * ```ts
   * sequenceOf(1, 2, 3).scan(0, (acc, n) => acc + n).toArray(); // [0, 1, 3, 6]
   * ```
   *
   * @param initial - The starting accumulator value.
   * @param operation - Called with `(accumulator, value)` for each element.
   * @typeParam R - The accumulator type.
   */
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

  /**
   * Returns the number of elements that satisfy the predicate.
   * When called with no argument, returns the total number of elements.
   * @param predicate - Called with each element. Defaults to always-true.
   */
  count(predicate: (value: T) => boolean = TruePredicate): number {
    let num = 0;
    for (let item of this) {
      if (predicate(item)) {
        num++;
      }
    }
    return num;
  }

  /**
   * Returns the element at the given zero-based index, or `undefined` if the index
   * is out of bounds.
   * @param index - Zero-based position.
   */
  elementAt(index: number): T | undefined {
    let i = 0;
    for (let item of this) {
      if (i === index) return item;
      i++;
    }
    return undefined;
  }

  /**
   * Returns the element at the given zero-based index, or the result of `defaultValue`
   * if the index is out of bounds.
   * @param index - Zero-based position.
   * @param defaultValue - Called with the requested index when it is out of bounds.
   */
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

  /**
   * Returns the zero-based index of the first occurrence of `element` (using `===`),
   * or `-1` if it is not found.
   * @param element - The value to search for.
   */
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

  /**
   * Returns the zero-based index of the first element matching the predicate,
   * or `-1` if none match.
   * @param predicate - Called with each element.
   */
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

  /**
   * Returns the zero-based index of the last element matching the predicate,
   * or `-1` if none match.
   * @param predicate - Called with each element.
   */
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

  /**
   * Returns a sequence containing the first `num` elements.
   * @param num - Number of elements to take. Defaults to `1`.
   */
  take(num: number = 1): Sequence<T> {
    return new Sequence(super.take(Math.max(0, num)));
  }

  /**
   * Returns a sequence of elements taken from the start while the predicate holds.
   * Stops at the first element that does not satisfy the predicate.
   * @param predicate - Called with each element.
   */
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

  /**
   * Returns a sequence that skips the first `num` elements.
   * @param num - Number of elements to skip. Defaults to `1`.
   */
  drop(num: number = 1): Sequence<T> {
    return new Sequence(super.drop(Math.max(0, num)));
  }

  /**
   * Returns a sequence that skips elements from the start while the predicate holds.
   * Once the predicate returns `false`, all remaining elements are included.
   * @param predicate - Called with each element.
   */
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

  /**
   * Returns a sequence containing only distinct elements (first occurrence wins).
   * Equality is determined using a `Set` (i.e. `SameValueZero`).
   */
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

  /**
   * Returns a sequence containing only elements with distinct keys as computed by `selector`.
   * First occurrence wins when two elements produce the same key.
   * @param selector - Extracts the key used for comparison.
   * @typeParam K - The key type.
   */
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

  /**
   * Groups elements into a `Map` by the key returned by `keySelector`.
   * An optional `valueTransform` can be supplied to transform each element before storing.
   * @param keySelector - Extracts the group key from each element.
   * @typeParam K - The key type.
   * @typeParam V - The value type (when `valueTransform` is provided).
   */
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

  /**
   * Returns the maximum element using the natural `>` ordering, or `undefined` if the
   * sequence is empty.
   */
  max(): T | undefined {
    let result: T | undefined = undefined;
    for (let item of this) {
      if (result == null || item > result) {
        result = item;
      }
    }
    return result;
  }

  /**
   * Returns the element for which `selector` returns the largest value, or `undefined`
   * if the sequence is empty.
   * @param selector - Extracts a comparable key from each element.
   * @typeParam R - The type of the selected key.
   */
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

  /**
   * Returns the maximum element according to the given `compare` function, or `undefined`
   * if the sequence is empty.
   * @param compare - Returns a positive number when the first argument is greater.
   */
  maxWith(compare: (a: T, b: T) => number): T | undefined {
    let max: T | undefined = undefined;
    for (let item of this) {
      if (max === undefined || compare(item, max) > 0) {
        max = item;
      }
    }
    return max;
  }

  /**
   * Returns the minimum element using the natural `<` ordering, or `undefined` if the
   * sequence is empty.
   */
  min(): T | undefined {
    let result: T | undefined = undefined;
    for (let item of this) {
      if (result == null || item < result) {
        result = item;
      }
    }
    return result;
  }

  /**
   * Returns the element for which `selector` returns the smallest value, or `undefined`
   * if the sequence is empty.
   * @param selector - Extracts a comparable key from each element.
   * @typeParam R - The type of the selected key.
   */
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

  /**
   * Returns the minimum element according to the given `compare` function, or `undefined`
   * if the sequence is empty.
   * @param compare - Returns a negative number when the first argument is smaller.
   */
  minWith(compare: (a: T, b: T) => number): T | undefined {
    let min: T | undefined = undefined;
    for (let item of this) {
      if (min === undefined || compare(item, min) < 0) {
        min = item;
      }
    }
    return min;
  }

  /**
   * Returns a sequence with the given element(s) excluded.
   * When `data` is an `Iterable`, all elements it contains are excluded.
   * When `data` is a single value, only that exact value (by `===`) is excluded.
   * @param data - A single element or an iterable of elements to exclude.
   */
  minus(data: T | Iterable<T>): Sequence<T> {
    if (isIterable(data)) {
      const exclusions = new Set<T>(data);
      return this.filter((it) => !exclusions.has(it));
    } else {
      return this.filter((it) => it !== data);
    }
  }

  /**
   * Returns a sequence that contains all elements of this sequence followed by
   * the given element or all elements of the given iterable.
   * @param element - A single element or an iterable to append.
   */
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

  /**
   * Returns a `Map` built by applying `transform` to each element and using the
   * resulting `[key, value]` pair. If two elements produce the same key, the last
   * value wins.
   * @param transform - Returns a `[key, value]` tuple for each element.
   * @typeParam K - The key type.
   * @typeParam V - The value type.
   */
  associate<K, V>(transform: (value: T) => [K, V]): Map<K, V> {
    const result = new Map<K, V>();
    for (let item of this) {
      const pair = transform(item);
      result.set(pair[0], pair[1]);
    }
    return result;
  }

  /**
   * Returns a `Map` keyed by the result of `keySelector` (or a property name).
   * An optional `valueTransformer` can transform the stored value.
   * If two elements produce the same key, the last value wins.
   *
   * @example
   * ```ts
   * sequenceOf({ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' })
   *   .associateBy('id'); // Map { 1 => { id: 1, name: 'Alice' }, 2 => { id: 2, name: 'Bob' } }
   * ```
   *
   * @param keySelector - A key-selector function or a property name of `T`.
   */
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

  /**
   * Returns a `Map` where each element is the key and `valueSelector` provides the value.
   * @param valueSelector - Called with each element to produce its associated value.
   * @typeParam V - The value type.
   */
  associateWith<V>(valueSelector: (value: T) => V): Map<T, V> {
    const result = new Map<T, V>();
    for (const item of this) {
      result.set(item, valueSelector(item));
    }
    return result;
  }

  /**
   * Returns a sequence of sliding windows of the given `size`.
   * @param size - The number of elements in each window. Must be ≥ 1.
   * @param step - How many elements to advance the window each time. Defaults to `1`.
   * @param partialWindows - When `true`, windows smaller than `size` at the end are included.
   *   Defaults to `false`.
   * @throws {Error} If `size` or `step` is less than `1`.
   *
   * @example
   * ```ts
   * sequenceOf(1, 2, 3, 4).windowed(2).toArray(); // [[1, 2], [2, 3], [3, 4]]
   * ```
   */
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

  /**
   * Splits the sequence into chunks of at most `chunkSize` elements.
   * The last chunk may be smaller if the sequence length is not divisible by `chunkSize`.
   * @param chunkSize - Maximum number of elements per chunk. Must be ≥ 1.
   * @throws {Error} If `chunkSize` is less than `1`.
   */
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

  /**
   * Splits the sequence into two arrays: the first contains elements that satisfy
   * the predicate, the second contains the rest.
   * @param predicate - Called with each element.
   * @returns A tuple `[matching, nonMatching]`.
   */
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

  /**
   * Returns the arithmetic mean of a numeric sequence.
   * Returns `NaN` for an empty sequence.
   */
  average(this: Sequence<number>): number {
    let sum = 0;
    let count = 0;
    for (let item of this) {
      sum += item;
      count++;
    }
    return count === 0 ? Number.NaN : sum / count;
  }

  /**
   * Returns the sum of all elements in a numeric sequence.
   * Returns `0` for an empty sequence.
   */
  sum(this: Sequence<number>): number {
    let result = 0;
    for (let item of this) {
      result += item;
    }
    return result;
  }

  /**
   * Returns the sum of the values returned by `selector` for each element.
   * Returns `0` for an empty sequence.
   * @param selector - Extracts a numeric value from each element.
   */
  sumBy(selector: (value: T) => number): number {
    let result = 0;
    for (let item of this) {
      result += selector(item);
    }
    return result;
  }

  /**
   * Joins all elements into a single string.
   * @param options.separator - String placed between elements. Defaults to `", "`.
   * @param options.prefix - String prepended to the result. Defaults to `""`.
   * @param options.postfix - String appended to the result. Defaults to `""`.
   * @param options.transform - Optional function to convert each element to a string.
   *   Defaults to `String(value)`.
   */
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

  /**
   * Returns a sequence of pairs built by combining the elements of this sequence
   * with elements from `other`. Stops when the shorter sequence is exhausted.
   * An optional `transform` function can produce a different type from each pair.
   * @param other - The iterable to zip with.
   * @typeParam S - The element type of `other`.
   * @typeParam R - The result type when `transform` is provided.
   */
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

  /**
   * Unzips a sequence of `[A, B]` pairs into a tuple of two arrays `[A[], B[]]`.
   * @typeParam A - The first element type of each pair.
   * @typeParam B - The second element type of each pair.
   */
  unzip<A, B>(this: Sequence<[A, B]>): [A[], B[]] {
    const array1: A[] = [];
    const array2: B[] = [];
    for (let [first, second] of this) {
      array1.push(first);
      array2.push(second);
    }
    return [array1, array2];
  }

  /**
   * Returns a sequence of pairs of each consecutive element with the next one.
   * An optional `transform` function can produce a different type from each pair.
   * The returned sequence has one fewer element than the original.
   *
   * @example
   * ```ts
   * sequenceOf(1, 2, 3).zipWithNext().toArray(); // [[1, 2], [2, 3]]
   * ```
   *
   * @typeParam R - The result type when `transform` is provided.
   */
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

  /**
   * Returns a new sequence with elements sorted in ascending order using natural ordering.
   * Materializes the sequence.
   */
  sorted(): Sequence<T> {
    return asSequence(this.toArray().sort((a, b) => (a < b ? -1 : a > b ? 1 : 0)));
  }

  /**
   * Returns a new sequence sorted in ascending order by the key returned by `selector`.
   * Materializes the sequence.
   * @param selector - Extracts a comparable sort key from each element.
   * @typeParam R - The key type.
   */
  sortedBy<R>(selector: (value: T) => R): Sequence<T> {
    return asSequence(
      this.toArray().sort((a, b) => {
        const ka = selector(a);
        const kb = selector(b);
        return ka < kb ? -1 : ka > kb ? 1 : 0;
      }),
    );
  }

  /**
   * Returns a new sequence sorted using the given `comparator`.
   * Materializes the sequence.
   * @param comparator - Standard comparator: negative when `a < b`, positive when `a > b`.
   */
  sortedWith(comparator: (a: T, b: T) => number): Sequence<T> {
    return asSequence(this.toArray().sort(comparator));
  }

  /**
   * Returns a new sequence with elements sorted in descending order using natural ordering.
   * Materializes the sequence.
   */
  sortedDescending(): Sequence<T> {
    return asSequence(this.toArray().sort((a, b) => (a < b ? 1 : a > b ? -1 : 0)));
  }

  /**
   * Returns a new sequence sorted in descending order by the key returned by `selector`.
   * Materializes the sequence.
   * @param selector - Extracts a comparable sort key from each element.
   * @typeParam R - The key type.
   */
  sortedByDescending<R>(selector: (value: T) => R): Sequence<T> {
    return asSequence(
      this.toArray().sort((a, b) => {
        const ka = selector(a);
        const kb = selector(b);
        return ka < kb ? 1 : ka > kb ? -1 : 0;
      }),
    );
  }

  /**
   * Returns a new sequence with elements in reverse order.
   * Materializes the sequence.
   */
  reverse(): Sequence<T> {
    return asSequence(this.toArray().reverse());
  }

  /**
   * Collects all elements into a `Set`.
   * @param set - An existing `Set` to add elements to. A new `Set` is created when omitted.
   */
  toSet(set?: Set<T>): Set<T> {
    const result = set || new Set<T>();
    for (let item of this) {
      result.add(item);
    }
    return result;
  }

  /**
   * Collects a sequence of `[key, value]` pairs into a `Map`.
   * @typeParam K - The key type.
   * @typeParam V - The value type.
   */
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

/**
 * Creates a `Sequence` from the given arguments.
 *
 * @example
 * ```ts
 * sequenceOf(1, 2, 3).map(n => n * 2).toArray(); // [2, 4, 6]
 * ```
 *
 * @typeParam T - The element type.
 */
export function sequenceOf<T>(...args: T[]): Sequence<T> {
  return new Sequence(getIterator(args));
}

/**
 * Creates an empty `Sequence`.
 * @typeParam T - The element type.
 */
export function emptySequence<T>(): Sequence<T> {
  return sequenceOf();
}

/**
 * Wraps any `Iterable` in a `Sequence`.
 *
 * @example
 * ```ts
 * asSequence([1, 2, 3]).filter(n => n > 1).toArray(); // [2, 3]
 * asSequence(new Set([1, 2, 2, 3])).toArray();        // [1, 2, 3]
 * ```
 *
 * @param iterable - Any iterable (array, `Set`, `Map`, generator, etc.).
 * @typeParam T - The element type.
 */
export function asSequence<T>(iterable: Iterable<T>): Sequence<T> {
  return new Sequence(getIterator(iterable));
}

/**
 * Creates a `Sequence` that lazily concatenates all given iterables in order.
 *
 * @example
 * ```ts
 * concat([1, 2], [3, 4], [5]).toArray(); // [1, 2, 3, 4, 5]
 * ```
 *
 * @param iterables - Zero or more iterables to concatenate.
 * @typeParam T - The element type.
 */
export function concat<T>(...iterables: Iterable<T>[]): Sequence<T> {
  return new Sequence(
    (function* () {
      for (const iterable of iterables) {
        yield* iterable;
      }
    })(),
  );
}

/**
 * Creates a `Sequence` of numbers from `start` (inclusive) to `endExclusive` (exclusive),
 * advancing by `step`.
 *
 * A negative `step` produces a descending range.
 *
 * @example
 * ```ts
 * range(1, 5).toArray();      // [1, 2, 3, 4]
 * range(0, 10, 3).toArray();  // [0, 3, 6, 9]
 * range(5, 1, -1).toArray();  // [5, 4, 3, 2]
 * ```
 *
 * @param start - The first value (inclusive).
 * @param endExclusive - The upper bound (exclusive).
 * @param step - The increment between values. Defaults to `1`. Must not be `0`.
 * @throws {Error} If `step` is `0`.
 */
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

/**
 * Creates an infinite (or finite) `Sequence` by repeatedly applying `next` to a seed value.
 * The sequence ends when `next` returns `null` or `undefined`.
 *
 * @example
 * ```ts
 * generate(1, n => n < 8 ? n * 2 : null).toArray(); // [1, 2, 4, 8]
 * ```
 *
 * @param seed - The first value in the sequence.
 * @param next - Called with the current value; returning `null`/`undefined` ends the sequence.
 * @typeParam T - The element type.
 */
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
