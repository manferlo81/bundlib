type OneByOneNext = () => void;
type OneByOneCallback<T> = (item: T, next: OneByOneNext | null) => unknown;

export function oneByOne<T>(arr: ArrayLike<T>, callback: OneByOneCallback<T>): void {

  let index = 0;
  const len = arr.length;
  const last = len - 1;

  const next: OneByOneNext = () => {

    if (index > last) {
      return;
    }

    callback(
      arr[index],
      (index < last) ? next : null,
    );

    index++;

  };

  next();

}
