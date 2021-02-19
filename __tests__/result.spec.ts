import { Ok, Err, Result, Some, None } from '../src';

describe('Result', () => {
  it('isOk', () => {
    expect(Ok('Pepe').isOk()).toBeTruthy();

    expect(Err('Error').isOk()).toBeFalsy();
  });

  it('isErr', () => {
    expect(Err('Error').isErr()).toBeTruthy();

    expect(Ok('Pepe').isErr()).toBeFalsy();
  });

  it('ok', () => {
    const okSomeResult = Ok('Pepe');
    expect(okSomeResult.ok()).toEqual(Some('Pepe'));

    const errSomeResult = Err('Error');
    expect(errSomeResult.ok()).toEqual(None());

    const okNoneResult = Err('Error');
    expect(okNoneResult.ok()).toEqual(None());
  });

  it('err', () => {
    const okSomeResult = Ok('Pepe');
    expect(okSomeResult.err()).toEqual(None());

    const errSomeResult = Err('Error');
    expect(errSomeResult.err()).toEqual(Some('Error'));

    const okNoneResult = Err('Error');
    expect(okNoneResult.err()).toEqual(Some('Error'));
  });

  it('match', () => {
    const ok = Ok(5);

    expect(
      ok.match({
        ok: num => num,
        err: _ => 'Error',
      }),
    ).toEqual(5);

    const err = Err(5);

    expect(
      err.match({
        ok: num => num,
        err: _ => 'Error',
      }),
    ).toEqual('Error');
  });

  it('expect', () => {
    expect(Ok(5).expect("It's okay")).toEqual(5);

    expect(Err('Error').expect).toThrowError();
  });

  it('expectErr', () => {
    expect(Err(5).expectErr("It's okay")).toEqual(5);

    expect(Ok(5).expectErr).toThrowError();
  });

  it('contains', () => {
    expect(Ok(5).contains(5)).toBeTruthy();
    expect(Ok(1).contains(222)).toBeFalsy();

    expect(Err('Error').contains('Error')).toBeFalsy();
  });

  it('containsErr', () => {
    expect(Err(5).containsErr(5)).toBeTruthy();
    expect(Err(5).containsErr(1)).toBeFalsy();

    expect(Ok(1).containsErr(2)).toBeFalsy();
  });

  it('unwrap', () => {
    expect(Ok(5).unwrap()).toEqual(5);

    expect(Err('Error').unwrap).toThrowError();
  });

  it('unwrapErr', () => {
    expect(Ok(5).unwrap).toThrowError();

    expect(Err('Error').unwrapErr()).toEqual('Error');
  });

  it('unwrapOr', () => {
    expect(Ok(5).unwrapOr(1)).toEqual(5);

    expect(Err('Error').unwrapOr('Error here')).toEqual('Error here');
  });

  it('unwrapOrElse', () => {
    expect(Ok(5).unwrapOrElse(() => 1)).toEqual(5);

    expect(Err('Error').unwrapOrElse(() => 'Error here')).toEqual('Error here');
  });

  it('map', () => {
    expect(
      Ok(5)
        .map(value => value * 2)
        .unwrap(),
    ).toEqual(10);

    expect(Err('Error').map(value => value * 2).unwrap).toThrowError();
  });

  it('mapErr', () => {
    expect(
      Err(5)
        .mapErr(value => value * 2)
        .unwrapErr(),
    ).toEqual(10);

    expect(Ok(10).mapErr(value => value * 2).unwrap).toThrowError();
  });

  it('flatten', () => {
    expect(Ok(5).flatten()).toEqual(Ok(5));
    expect(Ok(Ok(10)).flatten()).toEqual(Ok(10));

    expect(Err(15).flatten()).toEqual(Err(15));
  });

  it('toString', () => {
    const ok = Ok(5);
    expect(ok.toString()).toEqual('Ok(5)');

    const err = Err(10);
    expect(err.toString()).toEqual('Err(10)');
  });
});
