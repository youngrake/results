import { Ok as _Ok, Err as _Err } from './result';

export enum ResultType {
  OK = 'ok',
  ERR = 'err',
}

export const Ok = <T>(ok: T) => new _Ok(ok);

export const Err = <E>(err: E) => new _Err(err);
