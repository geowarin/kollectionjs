# kollectionjs

Lazy, chainable collection utilities for TypeScript, inspired by Kotlin's sequence API.

`Sequence<T>` is a native subclass of `Iterator<T>`. Operations are lazy — nothing runs until a terminal call like `toArray()` or `forEach()`.

## Installation

```sh
pnpm add kollectionjs
```

## Creating sequences

```ts
import { sequenceOf, asSequence, emptySequence, range, generate } from "kollectionjs";

sequenceOf(1, 2, 3); // from values
asSequence([1, 2, 3]); // from any Iterable
emptySequence<number>(); // empty
range(1, 5); // [1, 2, 3, 4]
range(0, 10, 2); // [0, 2, 4, 6, 8]
range(5, 0, -1); // [5, 4, 3, 2, 1]
generate(1, (x) => x * 2); // 1, 2, 4, 8, 16, ... (infinite — use .take())
```

## Lazy transformations

```ts
seq.filter(x => x > 1)
seq.filter((x, index) => index < 3)
seq.filterNot(x => x > 1)
seq.filterNotNull()             // narrows to Sequence<NonNullable<T>>
seq.map(x => x * 2)
seq.map((x, index) => `${index}: ${x}`)
seq.mapNotNull(x => x?.value)  // filters out null/undefined results
seq.flatMap(x => [x, x * 2])
seq.flatten()                  // Sequence<Iterable<U>> → Sequence<U>
seq.onEach(x => console.log(x))
seq.withIndex()                // → Sequence<{ index, value }>

seq.take(3)
seq.takeWhile(x => x < 5)
seq.drop(2)
seq.dropWhile(x => x < 5)

seq.distinct()
seq.distinctBy(x => x.id)
seq.sorted()
seq.sortedDescending()
seq.sortedBy(x => x.name)
seq.sortedDescendingBy(x => x.age)
seq.sortedWith((a, b) => a - b)
seq.reverse()

seq.plus(4)                    // append element
seq.plus([4, 5])               // append iterable
seq.minus(1)                   // remove element
seq.minus([1, 2])              // remove all matching

seq.zip(other)                 // → Sequence<[T, S]>
seq.zip(other, (a, b) => ...) // → Sequence<R>
seq.zipWithNext()              // → Sequence<[T, T]>
seq.zipWithNext((a, b) => ...) // → Sequence<R>
seq.chunk(3)                   // → Sequence<T[]> (lazy)
seq.windowed(3)                // → Sequence<T[]>
seq.windowed(3, 2)             // step 2
seq.windowed(3, 1, true)       // include partial windows
```

## Terminal operations

```ts
// Collect
seq.toArray()
seq.toSet()

// Search
seq.first()                    // throws if empty
seq.first(x => x > 2)
seq.firstOrNull()
seq.firstOrNull(x => x > 2)
seq.last()
seq.lastOrNull()
seq.find(x => x > 2)          // alias for firstOrNull
seq.findLast(x => x > 2)
seq.single()                   // throws if not exactly one match
seq.singleOrNull()
seq.elementAt(2)
seq.elementAtOrNull(2)
seq.elementAtOrElse(2, i => 0)
seq.contains(3)
seq.indexOf(3)
seq.indexOfFirst(x => x > 2)
seq.indexOfLast(x => x > 2)

// Test
seq.all(x => x > 0)           // alias: every()
seq.any(x => x > 0)           // alias: some()
seq.none(x => x < 0)
seq.isEmpty()
seq.isNotEmpty()
seq.count()
seq.count(x => x > 0)

// Aggregate
seq.fold(0, (acc, x) => acc + x)
seq.foldIndexed(0, (acc, x, i) => acc + x + i)
seq.reduce((acc, x) => acc + x) // native Iterator method
seq.reduceIndexed((acc, x, i) => acc + x + i)
seq.scan(0, (acc, x) => acc + x)        // → Sequence<R> (includes initial)
seq.runningFold(0, (acc, x) => acc + x) // alias for scan
seq.sum()                      // Sequence<number> only
seq.sumBy(x => x.price)
seq.average()                  // Sequence<number> only
seq.min()
seq.minBy(x => x.age)
seq.minWith((a, b) => a - b)
seq.max()
seq.maxBy(x => x.age)
seq.maxWith((a, b) => a - b)

// Group / partition
seq.groupBy(x => x.dept)
seq.groupBy(x => x.dept, x => x.name)  // Map<K, V[]>
seq.partition(x => x > 2)              // [T[], T[]]
seq.chunk(3).toArray()                  // T[][]

// Associate
seq.associate(x => [x.id, x])
seq.associateBy(x => x.id)
seq.associateBy("id")
seq.associateBy(x => x.id, x => x.name)
seq.associateWith(x => x.length)       // elements as keys

// Output
seq.joinToString()
seq.joinToString({ separator: " | ", prefix: "[", postfix: "]", transform: x => String(x) })
seq.unzip()                    // Sequence<[A, B]> → [A[], B[]]
seq.forEach(x => ...)          // native Iterator method
seq.forEach((x, i) => ...)
```

## Native Iterator methods

`Sequence<T>` extends the native `Iterator<T>`, so all built-in iterator helpers work directly:

```ts
seq.every((x) => x > 0);
seq.some((x) => x > 0);
seq.find((x) => x > 1);
seq.reduce((a, b) => a + b);
seq.flatMap((x) => [x, x * 2]);
seq.map((x) => x * 2);
seq.filter((x) => x > 1);
seq.take(3);
seq.drop(2);
seq.toArray();
```

## Development

```sh
pnpm build       # compile to dist/
pnpm test        # run tests
pnpm typecheck   # TypeScript type check
pnpm dev         # watch mode
```

## License

MIT
