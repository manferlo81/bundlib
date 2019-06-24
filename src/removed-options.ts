const removedOptions: Record<string, string> = {
  iife: "0.6.0",
  amd: "0.6.0",
  umd: "0.6.0",
};

export function getFirstRemovedOption(options?: Record<string, any>): { name: string, ver: string } | null {
  if (!options) {
    return null;
  }
  const optionNames = Object.keys(options);
  for (let i = 0, len = optionNames.length; i < len; i++) {
    const name = optionNames[i];
    const ver = removedOptions[name];
    if (ver) {
      return {
        name,
        ver,
      };
    }
  }
  return null;
}
