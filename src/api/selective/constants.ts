export const API_BUILD_KEYS = ['main', 'module', 'browser'] as const;
export const MODULE_BUILD_KEYS = [...API_BUILD_KEYS, 'bin'] as const;
export const SKIP_OPTION_KEYS = [...MODULE_BUILD_KEYS, 'types'] as const;

export const API_SPECIAL_KEYS = { api: API_BUILD_KEYS };
export const OVERRIDE_KEY = 'default';
