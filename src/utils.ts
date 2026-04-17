/** @internal */
export function getIterator<T>(iterable: Iterable<T>): Iterator<T> {
  return iterable[Symbol.iterator]();
}

/** @internal */
export function isIterable(obj: any): obj is Iterable<any> {
  return obj != null && typeof obj[Symbol.iterator] === "function";
}
