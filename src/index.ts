/**
 * @packageDocumentation
 *
 * **kollectionjs** — lazy, Kotlin-inspired collection utilities for JavaScript and TypeScript.
 *
 * Create a sequence from any iterable with {@link asSequence} or {@link sequenceOf},
 * then chain operations lazily before materializing with `toArray()`, `toSet()`, etc.
 *
 * @example
 * ```ts
 * import { asSequence, range, generate } from 'kollectionjs';
 *
 * asSequence([1, 2, 3, 4, 5])
 *   .filter(n => n % 2 === 0)
 *   .map(n => n * 10)
 *   .toArray(); // [20, 40]
 *
 * range(1, 10).sum(); // 45
 *
 * generate(1, n => n < 64 ? n * 2 : null).toArray(); // [1, 2, 4, 8, 16, 32, 64]
 * ```
 */
export * from "./Sequence";
