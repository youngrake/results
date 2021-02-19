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

  it('expect', () => {
    expect(Ok(5).expect("It's okay")).toEqual(5);

    expect(Err('Error').expect).toThrowError();
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
});
