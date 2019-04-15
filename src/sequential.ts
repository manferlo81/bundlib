function sequential<T>(arr: ArrayLike<T>, callback: (item: T, index: number, next: () => void) => void) {

  let index = 0;

  const next = () => {

    if (!(index in arr)) {
      return;
    }

    const item = arr[index++];

    callback(item, index, next);

  };

  next();

}

export default sequential;
