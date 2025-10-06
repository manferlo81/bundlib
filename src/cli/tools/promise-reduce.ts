type PromiseReduceCallback<I, T, R> = (prev: T, item: I) => R | Promise<R>;

export async function promiseReduce<I, T>(items: readonly I[], callback: PromiseReduceCallback<I, T, T>): Promise<T>;
export async function promiseReduce<I, T>(items: readonly I[], callback: PromiseReduceCallback<I, T | undefined, T>): Promise<T | undefined>;
export async function promiseReduce<I, T>(items: readonly I[], callback: PromiseReduceCallback<I, T | undefined, T>): Promise<T | undefined> {
  const { length } = items;
  let index = 0;

  const next = async (prev?: T) => {
    if (index >= length) return prev;
    const result = await callback(prev, items[index++]);
    return next(result);
  };

  return await next();
}
