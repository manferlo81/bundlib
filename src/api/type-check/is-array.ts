interface ExtendedArrayConstructor extends ArrayConstructor {
  isArray: (value: unknown) => value is unknown[];
}

export const { isArray } = Array as ExtendedArrayConstructor;
