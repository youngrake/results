import { unwrapFailed } from './../errors';
import { copy } from '../helpers';

import { ResultType } from './values';
import { ResultVariations } from './../types.d';
import { Some, None, Option } from '../Option';

interface MatchResult<T, E, Ok, Err> {
  ok?: (ok: T) => Ok;
  err?: (err: E) => Err;
}

export class Result<T, E> {
  private type: ResultVariations;

  private error?: E;
  private value?: T;

  constructor(type: ResultVariations, value: T | E) {
    this.type = type;

    if (type === ResultType.OK) {
      this.value = value as T;
    } else {
      this.error = value as E;
    }
  }

  public isOk(): boolean {
    return this.type === ResultType.OK;
  }

  public isErr(): boolean {
    return this.type === ResultType.ERR;
  }

  public ok(): Option<T> {
    if (this.isOk()) {
      return Some(this.value);
    }

    return None();
  }

  public err(): Option<E> {
    if (this.isOk()) {
      return None();
    }

    return Some(this.error);
  }

  public match<Ok, Err>({ ok, err }: MatchResult<T, E, Ok, Err>): Ok | Err | null {
    if (this.isOk()) {
      return ok ? ok(this.cloneOk()) : null;
    }

    return err ? err(this.cloneErr()) : null;
  }

  public expect(message = ''): T {
    if (this.isErr()) {
      unwrapFailed(message, this.error);
    }

    return this.value;
  }

  public expectErr(message = ''): E {
    if (this.isOk()) {
      unwrapFailed(message, this.value);
    }

    return this.error;
  }

  public cloneOk(): T {
    return copy(this.value);
  }

  public cloneErr(): E {
    return copy(this.error);
  }

  public contains<U extends any>(x: U): boolean {
    if (this.isOk()) {
      return this.value == x;
    }

    return false;
  }

  public containsErr<F extends any>(f: F): boolean {
    if (this.isErr()) {
      return this.error == f;
    }

    return false;
  }

  public unwrap(): T {
    if (this.isErr()) {
      unwrapFailed('called `unwrap()` on an `Err` value', this.error);
    }

    return this.value;
  }

  public unwrapErr(): E {
    if (this.isOk()) {
      unwrapFailed('called `unwrap_err()` on an `Ok` value', this.value);
    }

    return this.error;
  }

  public unwrapOr(defaultValue: T): T {
    if (this.isOk()) {
      return this.value;
    }

    return defaultValue;
  }

  public unwrapOrElse<F extends (val: E) => T>(op: F): T {
    if (this.isOk()) {
      return this.value;
    }

    return op(this.error);
  }

  public map<U, F extends (val: T) => U>(op: F): Result<U, E> {
    if (this.isOk()) {
      return new Ok(op(this.value));
    }

    return new Err(this.error);
  }

  public mapErr<F, O extends (val: E) => F>(op: O): Result<T, F> {
    if (this.isOk()) {
      return new Ok(this.value);
    }

    return new Err(op(this.error));
  }

  public mapOr<U, F extends (val: T) => U>(defaultValue: U, fn: F): U {
    if (this.isOk()) {
      return fn(this.value);
    }

    return defaultValue;
  }

  public mapOrElse<U, D extends (val: E) => U, F extends (val: T) => U>(defaultFn: D, fn: F): U {
    if (this.isOk()) {
      return fn(this.value);
    }

    return defaultFn(this.error);
  }

  public and<U>(res: Result<U, E>): Result<U, E> {
    if (this.isOk()) {
      return res;
    }

    return new Err(this.cloneErr());
  }

  public andThen<U, F extends (val: T) => Result<U, E>>(op: F): Result<U, E> {
    if (this.isOk()) {
      return op(this.cloneOk());
    }

    return new Err(this.cloneErr());
  }

  public flatten(): Result<T, E> {
    if (this.isErr()) {
      return new Err(this.error);
    }

    if (this.value instanceof Result) {
      return this.value;
    }

    return new Ok(this.cloneOk());
  }

  public toString(): string {
    return this.isOk() ? `Ok(${this.value.toString()})` : `Err(${this.error.toString()})`;
  }
}

export class Ok<T> extends Result<T, any> {
  constructor(value: T) {
    super(ResultType.OK, value);
  }
}

export class Err<E> extends Result<any, E> {
  constructor(error: E) {
    super(ResultType.ERR, error);
  }
}
