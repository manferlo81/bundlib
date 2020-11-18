import { error } from './error';
import { fmt } from './fmt';

export const invalidPkgField = fmt<(field: string, type: string) => TypeError>(
  'Invalid package.json "${0}" field. It has to be of type ${1}',
);

export const invalidOptionOld = fmt<(option: string, type: string) => TypeError>(
  'Invalid "${0}" option. It has to be ${1}',
);

export function invalidOption(optionName: string, urlHash?: string): TypeError {
  return error(`Invalid "${optionName}" option. Please check the documentation at https://github.com/manferlo81/bundlib#${urlHash || optionName}`);
}

export const inputNotFound = fmt<(type: string) => TypeError>(
  'Input file not found for ${0}',
);
