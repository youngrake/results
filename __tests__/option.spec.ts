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

  it('replace', () => {
    const some = Some(1);

    expect(some.replace(5)).toEqual(Some(1));
    expect(some.unwrap()).toEqual(5);
  });

  it('map', () => {
    const some = Some('pepega');
    expect(some.map(c => c.toUpperCase())).toEqual(Some('PEPEGA'));

    const none = None();
    expect(None().map(value => !!value)).toEqual(None());
  });

  it('filter', () => {
    const some = Some(4);
    expect(some.filter(num => num % 2 == 0).unwrap()).toEqual(4);

    const none = None();
    expect(none.filter(value => !!value)).toEqual(None());
  });

  it('toString', () => {
    const some = Some(4);
    expect(some.toString()).toEqual('Some(4)');

    const none = None();
    expect(none.toString()).toEqual('None');
  });
});
