export class Panic extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = 'Panic';
  }
}

export const unwrapFailed = <T>(msg: string, value: T): void => {
  throw new Panic(`${msg}: ${JSON.stringify(value)}`);
};
