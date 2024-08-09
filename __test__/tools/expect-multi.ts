export function expectMultiPromise<T>(items: T[], callback: (item: T) => Promise<void>) {
  expect.assertions(items.length);
  return Promise.all(items.map((item) => callback(item)));
}
