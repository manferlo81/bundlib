export function error<E extends Error = TypeError>(msg: string, ErrorType: ErrorConstructor = TypeError): E {
  return new ErrorType(msg) as E;
}

export function invalidPkgField(field: string, type: string): TypeError {
  return error(`Invalid package.json "${field}" field. It has to be of type ${type}`);
}

export function invalidOptionOld(option: string, type: string): TypeError {
  return error(`Invalid "${option}" option. It has to be ${type}`);
}

export function invalidOption(optionName: string, urlHash?: string): TypeError {
  return error(`Invalid "${optionName}" option. Please check the documentation at https://github.com/manferlo81/bundlib#${urlHash || optionName}`);
}

export function inputNotFound(type: string): TypeError {
  return error(`Input file not found for ${type}`);
}
