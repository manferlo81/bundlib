export function invalidPkgFieldMessage(field: string, type: string) {
  return `Invalid package.json "${field}" field. It has to be of type ${type}`
}

export function invalidOptionMessage(optionName: string) {
  const hashName = optionName.toLowerCase()
  return `Invalid "${optionName}" option. Please check the documentation at https://github.com/manferlo81/bundlib#option-${hashName}`
}

export function inputNotFoundMessage(type: string) {
  return `Input file not found for ${type}`
}
