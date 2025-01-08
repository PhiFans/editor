import { v4 as uuid } from 'uuid';

export class UUIDMap<T> extends Map<string, T> {
  push(value: T) {
    const key = uuid();
    this.set(key, value);
  }
}
