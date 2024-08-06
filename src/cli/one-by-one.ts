type OneByOneNext = (error?: unknown) => void;
type OneByOneCallback<T> = (item: T, next: OneByOneNext) => unknown;

export function oneByOne<T>(arr: ArrayLike<T>, callback: OneByOneCallback<T>, done: OneByOneNext): void {

  let index = 0;
  const { length: len } = arr;

  const next: OneByOneNext = (error) => {

    if (error) {
      // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
      return done(error);
    }

    if (index >= len) {
      // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
      return done();
    }

    callback(
      arr[index],
      next,
    );

    index++;

  };

  next();

}
