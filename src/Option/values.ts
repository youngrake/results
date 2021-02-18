import { OptionType } from '../types';
import { Option } from './option';

export function Some<T>(some: OptionType<T>) {
  if (typeof some == 'undefined') {
    throw new TypeError('Error.');
  }

  return new Option(some);
}

export function None<T>(): Option<T> {
  return new Option(null);
}
