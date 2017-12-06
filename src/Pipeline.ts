import {getIterableIterator} from "./utils";

export type OperationWork = (previousOperation: Operation) => IterableIterator<any>

export class Operation {
  previousOperation: Operation;

  constructor(private operationWork: OperationWork) {
  }

  iterator() {
    return this.operationWork(this.previousOperation);
  }
}

export class Pipeline<T> implements Iterable<T> {
  private lastOperation: Operation;

  constructor(private iterable: IterableIterator<T>) {
    this.lastOperation = new Operation(() => getIterableIterator(iterable));
  }

  [Symbol.iterator](): Iterator<T> {
    return this.lastOperation.iterator();
  }

  addOperation(work: OperationWork) {
    const newOperation = new Operation(work);
    newOperation.previousOperation = this.lastOperation;
    this.lastOperation = newOperation;
  }
}