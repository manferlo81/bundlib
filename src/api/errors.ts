export function error(msg: string): TypeError {
  return new TypeError(msg);
}

export function invalidPkgField(field: string, type: string): TypeError {
  return error(`Invalid package.json "${field}" field. It has to be of type ${type}`);
}

export function invalidOption(option: string, type: string): TypeError {
  return error(`Invalid "${option}" option. It has to be ${type}`);
}
