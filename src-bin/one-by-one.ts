type OneByOneNext = () => void;
type OneByOneCallback<T> = (item: T, next: OneByOneNext, index: number) => void;

function createNext<T>(arr: ArrayLike<T>, callback: OneByOneCallback<T>): OneByOneNext {

  let index = 0;

  const next: OneByOneNext = () => {

    if (!(index in arr)) {
      return;
    }

    const currentIndex = index++;
    const item = arr[currentIndex];

    callback(item, next, currentIndex);

  };

  return next;

}

function oneByOne<T>(arr: ArrayLike<T>, callback: OneByOneCallback<T>): void {
  const next = createNext(arr, callback);
  next();
}

export default oneByOne;
