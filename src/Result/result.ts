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

  public expect(message = ''): T {
    if (this.isErr()) {
      throw new TypeError(message);
    }

    return this.value;
  }

  public unwrap(): T {
    if (this.isErr()) {
      // TODO: unwrapFailed(message: string, error: Error)
      throw new TypeError('called `unwrap()` on an `Err` value');
    }

    return this.value;
  }

  public unwrapErr(): E {
    if (this.isOk()) {
      // TODO: unwrapFailed(message: string, error: Error)
      throw new TypeError('called `Result::unwrap_err()` on an `Ok` value');
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
