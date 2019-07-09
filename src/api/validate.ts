const hasOwn = Object.prototype.hasOwnProperty;

interface ValidationError {
  key: string;
  type: number;
}

function validateObj<K extends string>(
  object: Record<K, any>,
  validators: Record<K, ((param: any) => boolean) | Record<string, any>>,
  strict: boolean,
): ValidationError[] | null {
  const errors: ValidationError[] = [];
  for (const key in object) {
    if (hasOwn.call(object, key)) {
      if (!(key in validators)) {
        errors.push({
          key,
          type: 0, // no validator
        });
        continue;
      }
      const value = object[key as K];
      const validator = validators[key as K];
      if (typeof validator === "function") {
        if (!validator(value)) {
          errors.push({
            key,
            type: 2, // invalid
          });
          continue;
        }
      } else {
        if (typeof value !== "object") {
          errors.push({
            key,
            type: 2, // invalid
          });
          continue;
        }
        const valueErrors = validateObj(value, validator as Record<string, any>, strict);
        if (valueErrors) {
          errors.push(...valueErrors.map(({ key: valueKey, type }) => ({ key: `${key}.${valueKey}`, type })));
        }
      }
    }
  }
  if (strict) {
    for (const key in validators) {
      if (hasOwn.call(validators, key)) {
        if (!(key in object)) {
          errors.push({
            key,
            type: 1, // missing
          });
        }
      }
    }
  }
  return errors.length ? errors : null;
}
