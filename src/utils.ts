export function getIterableIterator<T>(iterable: IterableIterator<T> | Array<T>): IterableIterator<T> {
  return iterable [Symbol.iterator]()
}

export function getIterator<T>(iterable: Iterable<T>): Iterator<T> {
  return iterable [Symbol.iterator]()
}

export function isIterable(obj: any): obj is Iterable<any> {
  return obj != null && typeof obj[Symbol.iterator] === 'function';
}

export function entries<T>(obj: { [k: string]: T }) {
  return Object.keys(obj).map(key => [key, obj[key]]);
}