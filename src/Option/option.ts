import { OptionType } from '../types.d';
import { Some, None } from './values';

import { copy } from '../helpers';
import { expectFailed } from '../errors';

interface MatchOption<T, S, N> {
  some?: (some: T) => S;
  none?: () => N;
}

export class Option<T> {
  value: OptionType<T>;

  constructor(val: OptionType<T>) {
    this.value = val;
  }

  public clone(): T {
    return copy(this.value);
  }

  public default(): Option<null | undefined> {
    return None();
  }

  public isSome(): boolean {
    return !!this.value;
  }

  public isNone(): boolean {
    return !this.isSome();
  }

  /**
   * UNSAFE
   */
  public insert(val: T): Option<T> {
    this.value = val;

    return this;
  }

  public match<Some, None>({ some, none }: MatchOption<T, Some, None>): Some | None | null {
    if (this.isNone()) {
      return none ? none() : null;
    }

    return some ? some(this.clone()) : null;
  }

  public unwrap(): T | never {
    if (this.isNone()) {
      throw new TypeError('called `unwrap()` on a `None` value');
    }

    return this.value;
  }

  public unwrapOr(defaultValue: T): T {
    if (this.isNone()) {
      return defaultValue;
    }

    return this.value;
  }

  public expect(message: string): T {
    if (this.isNone()) {
      expectFailed(message);
    }

    return this.value;
  }

  public filter<P extends (val: T) => boolean>(predicate: P): Option<T> {
    if (this.isNone()) {
      return None();
    }

    const cloned = this.clone();
    if (predicate(cloned)) {
      return Some(cloned);
    }

    return None();
  }

  public replace(newValue: T): Option<T> {
    const oldValue = this.clone();
    this.value = newValue;
    return Some(oldValue);
  }

  public map<U, F extends (val: T) => U>(fn: F): Option<U> {
    if (this.isNone()) {
      return None();
    }

    return Some(fn(this.clone()));
  }

  public mapOr<U, F extends (val: T) => U>(defaultValue: U, fn: F): U {
    if (this.isNone()) {
      return defaultValue;
    }

    return fn(this.clone());
  }

  public mapOrElse<U, D extends () => U, F extends (val: T) => U>(defaultFn: D, fn: F): U {
    if (this.isNone()) {
      return defaultFn();
    }

    return fn(this.clone());
  }

  public flatten(): Option<T> {
    if (this.isNone()) {
      return None();
    }

    if (this.value instanceof Option) {
      return this.value;
    }

    return Some(this.value);
  }

  public and<U>(optb: Option<U>): Option<U> {
    if (this.isSome()) {
      return optb;
    }

    return None();
  }

  public andThen<U, F extends (val: T) => Option<U>>(fn: F): Option<U> {
    if (this.isSome()) {
      return fn(this.clone());
    }

    return None();
  }

  public toString(): string {
    if (this.isNone()) {
      return 'None';
    }

    return `Some(${this.value.toString()})`;
  }
}
