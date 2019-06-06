export function error(msg: string): TypeError {
  return new TypeError(msg);
}

export function invalidPkgField(fieldName: string): TypeError {
  return error(`Invalid package.json ${fieldName} field.`);
}

export function invalidOption(optionName: string): TypeError {
  return error(`Invalid ${optionName} options.`);
}
