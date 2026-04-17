# kollectionjs

Lazy, chainable collection utilities for TypeScript, inspired by Kotlin's sequence API.

`Sequence<T>` is a native subclass of `Iterator<T>`. Operations are lazy — nothing runs until a terminal call like `toArray()` or `forEach()`.

Github repo: https://github.com/geowarin/kollectionjs

## Installation

```sh
pnpm add kollectionjs
```

## API Reference

Full API documentation is available [here](https://geowarin.com/kollectionjs/).

<!-- API:START -->

### Factory functions

|                 | Description                                                                               |
| --------------- | ----------------------------------------------------------------------------------------- |
| `asSequence`    | Wraps any `Iterable` in a `Sequence`.                                                     |
| `concat`        | Creates a `Sequence` that lazily concatenates all given iterables in order.               |
| `emptySequence` | Creates an empty `Sequence`.                                                              |
| `generate`      | Creates an infinite (or finite) `Sequence` by repeatedly applying `next` to a seed value. |
| `range`         | Creates a `Sequence` of numbers from `start` (inclusive) to `endExclusive` (exclusive),   |
| `sequenceOf`    | Creates a `Sequence` from the given arguments.                                            |

### `Sequence<T>` methods

|                      | Description                                                                               |
| -------------------- | ----------------------------------------------------------------------------------------- |
| `associate`          | Returns a `Map` built by applying `transform` to each element and using the               |
| `associateBy`        | Returns a `Map` keyed by the result of `keySelector` (or a property name).                |
| `associateWith`      | Returns a `Map` where each element is the key and `valueSelector` provides the value.     |
| `average`            | Returns the arithmetic mean of a numeric sequence.                                        |
| `chunk`              | Splits the sequence into chunks of at most `chunkSize` elements.                          |
| `contains`           | Returns `true` if the sequence contains the given element (using `===`).                  |
| `count`              | Returns the number of elements that satisfy the predicate.                                |
| `distinct`           | Returns a sequence containing only distinct elements (first occurrence wins).             |
| `distinctBy`         | Returns a sequence containing only elements with distinct keys as computed by `selector`. |
| `drop`               | Returns a sequence that skips the first `num` elements.                                   |
| `dropWhile`          | Returns a sequence that skips elements from the start while the predicate holds.          |
| `elementAt`          | Returns the element at the given zero-based index, or `undefined` if the index            |
| `elementAtOrElse`    | Returns the element at the given zero-based index, or the result of `defaultValue`        |
| `filter`             | Returns a sequence containing only the elements that satisfy the predicate.               |
| `filterNot`          | Returns a sequence containing only the elements that do **not** satisfy the predicate.    |
| `filterNotNull`      | Returns a sequence with all `null` and `undefined` elements removed.                      |
| `find`               | Returns the first element matching the predicate, or `undefined` if none match.           |
| `first`              | Returns the first element matching the predicate, or `undefined` if none match.           |
| `flatMap`            | Maps each element to an iterable and flattens the results into a single sequence.         |
| `flatten`            | Flattens a sequence of iterables into a single sequence.                                  |
| `fold`               | Accumulates a value by applying `operation` left-to-right, starting from `initial`.       |
| `groupBy`            | Groups elements into a `Map` by the key returned by `keySelector`.                        |
| `indexOf`            | Returns the zero-based index of the first occurrence of `element` (using `===`),          |
| `indexOfFirst`       | Returns the zero-based index of the first element matching the predicate,                 |
| `indexOfLast`        | Returns the zero-based index of the last element matching the predicate,                  |
| `isEmpty`            | Returns `true` if the sequence contains no elements.                                      |
| `isNotEmpty`         | Returns `true` if the sequence contains at least one element.                             |
| `joinToString`       | Joins all elements into a single string.                                                  |
| `last`               | Returns the last element matching the predicate, or `undefined` if none match.            |
| `map`                | Returns a sequence where each element is transformed by `transform`.                      |
| `mapNotNull`         | Returns a sequence of transformed elements, skipping any `null` or `undefined` results.   |
| `max`                | Returns the maximum element using the natural `>` ordering, or `undefined` if the         |
| `maxBy`              | Returns the element for which `selector` returns the largest value, or `undefined`        |
| `maxWith`            | Returns the maximum element according to the given `compare` function, or `undefined`     |
| `min`                | Returns the minimum element using the natural `<` ordering, or `undefined` if the         |
| `minBy`              | Returns the element for which `selector` returns the smallest value, or `undefined`       |
| `minus`              | Returns a sequence with the given element(s) excluded.                                    |
| `minWith`            | Returns the minimum element according to the given `compare` function, or `undefined`     |
| `none`               | Returns `true` if **no** element satisfies the predicate.                                 |
| `onEach`             | Performs the given `action` on each element and returns the same sequence unchanged.      |
| `partition`          | Splits the sequence into two arrays: the first contains elements that satisfy             |
| `plus`               | Returns a sequence that contains all elements of this sequence followed by                |
| `reverse`            | Returns a new sequence with elements in reverse order.                                    |
| `scan`               | Returns a sequence of running accumulator values, starting with `initial`.                |
| `single`             | Returns the single element matching the predicate, or `undefined` if there is             |
| `some`               | Returns `true` if **any** element satisfies the predicate.                                |
| `sorted`             | Returns a new sequence with elements sorted in ascending order using natural ordering.    |
| `sortedBy`           | Returns a new sequence sorted in ascending order by the key returned by `selector`.       |
| `sortedDescending`   | Returns a new sequence with elements sorted in descending order using natural ordering.   |
| `sortedDescendingBy` | Returns a new sequence sorted in descending order by the key returned by `selector`.      |
| `sortedWith`         | Returns a new sequence sorted using the given `comparator`.                               |
| `sum`                | Returns the sum of all elements in a numeric sequence.                                    |
| `sumBy`              | Returns the sum of the values returned by `selector` for each element.                    |
| `take`               | Returns a sequence containing the first `num` elements.                                   |
| `takeWhile`          | Returns a sequence of elements taken from the start while the predicate holds.            |
| `toMap`              | Collects a sequence of `[key, value]` pairs into a `Map`.                                 |
| `toSet`              | Collects all elements into a `Set`.                                                       |
| `unzip`              | Unzips a sequence of `[A, B]` pairs into a tuple of two arrays `[A[], B[]]`.              |
| `windowed`           | Returns a sequence of sliding windows of the given `size`.                                |
| `withIndex`          | Returns a sequence of `{ index, value }` pairs, where `index` is the                      |
| `zip`                | Returns a sequence of pairs built by combining the elements of this sequence              |
| `zipWithNext`        | Returns a sequence of pairs of each consecutive element with the next one.                |

<!-- API:END -->

## Development

```sh
pnpm build       # compile to dist/
pnpm test        # run tests
pnpm typecheck   # TypeScript type check
pnpm dev         # watch mode
```

## License

MIT
