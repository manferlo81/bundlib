type OneByOneNext = (error?: unknown) => void;
type OneByOneCallback<T> = (item: T, next: OneByOneNext) => unknown;

export function oneByOne<T>(arr: ArrayLike<T>, callback: OneByOneCallback<T>, done: OneByOneNext): void {

  let index = 0;
  const len = arr.length;

  const next: OneByOneNext = (error) => {

    if (error) {
      return done(error);
    }

    if (index >= len) {
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
