import {getIterableIterator} from "./utils";

export type OperationWork = (previousOperation: Operation) => IterableIterator<any>

export class Operation {
  previousOperation: Operation;

  constructor(private operationWork: OperationWork) {
  }

  iterator(): IterableIterator<any> {
    return this.operationWork(this.previousOperation);
  }
}

export class Pipeline<T> implements Iterable<T> {
  private operations: Operation[] = [];

  constructor(private iterable: IterableIterator<T>) {
    this.addOperation(() => getIterableIterator(iterable));
  }

  [Symbol.iterator](): Iterator<T> {
    return this.operations[0].iterator();
  }

  addOperation(work: OperationWork) {
    const newOperation = new Operation(work);
    newOperation.previousOperation = this.operations[0];
    this.operations.unshift(newOperation);
  }
}