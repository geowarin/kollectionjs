# kollectionjs

Collection utilities inspired by Kotlin for JavaScript/TypeScript.

`Sequence<T>` is a lazy, chainable iterator — a native subclass of `Iterator<T>` with Kotlin-style collection methods on top.

## Usage

```ts
import { sequenceOf, asSequence } from "kollectionjs";

// Create a sequence
const seq = sequenceOf(1, 2, 3, 4, 5);

// Lazy chain — nothing runs until a terminal call
const result = seq
  .filter((x) => x % 2 === 0)
  .map((x) => x * 10)
  .toArray(); // [20, 40]

// From any iterable
asSequence([1, 2, 3])
  .map((x) => x * 2)
  .toArray(); // [2, 4, 6]
```

## Native Iterator methods

Because `Sequence<T>` extends the native `Iterator<T>` class, all built-in iterator helpers are available directly:

```ts
sequenceOf(1, 2, 3).every((x) => x > 0); // true
sequenceOf(1, 2, 3).some((x) => x > 2); // true
sequenceOf(1, 2, 3).find((x) => x > 1); // 2
sequenceOf(1, 2, 3).reduce((a, b) => a + b); // 6
```

## Kotlin-style extras

On top of the native API, `Sequence<T>` adds methods familiar from Kotlin collections:

```ts
sequenceOf(1, 2, 3).first(); // 1
sequenceOf(1, 2, 3).firstOrNull((x) => x > 5); // null
sequenceOf(1, 2, 3).last((x) => x < 3); // 2
sequenceOf(1, 2, 3).count((x) => x > 1); // 2
sequenceOf(1, 2, 3).fold(0, (acc, x) => acc + x); // 6

sequenceOf(1, 1, 2, 3).distinct().toArray(); // [1, 2, 3]
sequenceOf(1, 2, 3, 4).partition((x) => x % 2 === 0); // { true: [2, 4], false: [1, 3] }
sequenceOf(1, 2, 3).associate((x) => [x, x * x]); // Map { 1 => 1, 2 => 4, 3 => 9 }
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
