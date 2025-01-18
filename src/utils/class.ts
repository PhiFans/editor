import { v4 as uuid } from 'uuid';
import { EventEmitter } from 'eventemitter3';

export class UUIDMap<T> extends Map<string, T> {
  push(value: T) {
    const key = uuid();
    this.set(key, value);
  }
}

export class ArrayEvented<T> extends Array<T> {
  readonly event: EventEmitter = new EventEmitter();

  constructor(initData?: T[]) {
    super();
    if (initData) this.push(...initData);
  }
}
