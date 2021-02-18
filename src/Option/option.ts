import { OptionType } from '../types.d';
import { Some, None } from './values';

import { copy } from '../helpers';

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
      throw new Error(message);
    }
    return this.value;
  }

  public toString(): string {
    if (this.isNone()) {
      return 'None';
    }

    return `Some(${this.value.toString()})`;
  }
}