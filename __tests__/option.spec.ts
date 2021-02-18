import { Option, None, Some } from '../src';

describe('Option', () => {
  it('default', () => {
    expect(Some(1).default()).toEqual(None());
  });

  it('isSome', () => {
    expect(Some(1).isSome()).toBeTruthy();

    expect(None().isSome()).toBeFalsy();
  });

  it('isNone', () => {
    expect(None().isNone()).toBeTruthy();

    expect(Some(1).isNone()).toBeFalsy();
  });

  it('clone', () => {
    const some = Some(1);
    expect(some.clone()).toEqual(1);
  });

  it('unwrap', () => {
    expect(Some(1).unwrap()).toEqual(1);
    expect(Some({ name: 'Dima' }).unwrap()).toEqual({ name: 'Dima' });

    expect(None().unwrap).toThrowError();
  });

  it('unwrapOr', () => {
    expect(Some(1).unwrapOr(10)).toEqual(1);
    expect(None().unwrapOr(1)).toEqual(1);
  });

  it('match', () => {
    expect(
      Some(1).match({
        some: x => x,
        none: () => 'None',
      }),
    ).toEqual(1);

    expect(
      None().match({
        some: x => x,
        none: () => 'None',
      }),
    ).toEqual('None');
  });
});
