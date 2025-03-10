type UnknownArray = unknown[];

interface ExtendedArrayConstructor extends ArrayConstructor {
  isArray: (value: unknown) => value is UnknownArray;
}

export const { isArray } = Array as ExtendedArrayConstructor;
