import { MinOption } from "./bundlib-options";
import { MinifyOptions } from "./pkg-analized";
import { isArray } from "./type-check";

function baseMinOption(value?: boolean): MinifyOptions {
  return ["main", "module", "browser"].reduce<Record<string, boolean>>((options, field) => {
    options[field] = !!value;
    return options;
  }, {} as Record<string, boolean>);
}

function normalizeMinOption(min: MinOption | undefined): MinifyOptions {
  return !min
    ? baseMinOption()
    : min === true
      ? baseMinOption(true)
      : isArray(min)
        ? min.reduce((result, value) => {
          result[value] = true;
          return result;
        }, baseMinOption())
        : Object.assign(baseMinOption(), {
          [min]: true,
        });
}

export default normalizeMinOption;
