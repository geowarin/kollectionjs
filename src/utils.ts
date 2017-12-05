export function getIterator(iterable: any): IterableIterator<any> {
  return iterable [Symbol.iterator]()
}

export function isIterable(obj: any) {
  return obj != null && typeof obj[Symbol.iterator] === 'function';
}

export function entries<T>(obj: { [k: string]: T }) {
  return Object.keys(obj).map(key => [key, obj[key]]);
}