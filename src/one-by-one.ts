type OneByOneNext = (err?: Error) => Promise<any> | any;
type OneByOneCallback<T> = (item: T, next: OneByOneNext, index: number) => Promise<any> | any;

function createNext<T>(arr: ArrayLike<T>, callback: OneByOneCallback<T>) {

  let index = 0;

  const next: OneByOneNext = async (err) => {

    if (!(index in arr)) {
      return;
    }

    const prevIndex = index++;
    const item = arr[prevIndex];

    return await callback(item, next, prevIndex);

  };

  return next;

}

function oneByOne<T>(arr: ArrayLike<T>, callback: OneByOneCallback<T>) {

  const next = createNext(arr, callback);

  return next();

}

export default oneByOne;
