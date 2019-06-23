type OneByOneNext = (err?: Error) => Promise<any> | any;
type OneByOneCallback<T> = (item: T, next: OneByOneNext, index: number) => Promise<any> | any;

function createNext<T>(arr: ArrayLike<T>, callback: OneByOneCallback<T>) {

  let index = 0;

  const next: OneByOneNext = async (err) => {

    if (!(index in arr)) {
      return;
    }

    const currentIndex = index++;
    const item = arr[currentIndex];

    callback(item, next, currentIndex);

  };

  return next;

}

function oneByOne<T>(arr: ArrayLike<T>, callback: OneByOneCallback<T>) {

  const next = createNext(arr, callback);
  next();

}

export default oneByOne;
