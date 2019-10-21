export type InList<M extends string> = (str: string) => str is M;

export function createInList<M extends string>(...model: M[]): InList<M> {
  return (str: string): str is M => (
    model.indexOf(str as M) !== -1
  );
}
