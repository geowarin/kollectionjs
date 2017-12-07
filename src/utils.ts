
export function getIterator<T>(iterable: Iterable<T>): Iterator<T> {
  return iterable [Symbol.iterator]()
}

export function isIterable(obj: any): obj is Iterable<any> {
  return obj != null && typeof obj[Symbol.iterator] === 'function';
}

export function contains<T>(iterable: Iterable<T>, element: T): boolean {
  for (let item of iterable) {
    if (element === item) {
      return true;
    }
  }
  return false;
}