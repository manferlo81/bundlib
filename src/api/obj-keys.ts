const keys: (
  <K extends keyof any>(
    object: Partial<Record<K, any>>,
  ) => Array<K extends string ? K : string>
) = Object.keys;
export default keys;
