export const API_BUILD_KEYS: ['main', 'module', 'browser'] = ['main', 'module', 'browser'];
export const MODULE_BUILD_KEYS = [...API_BUILD_KEYS, 'bin'] as ['main', 'module', 'browser', 'bin'];
export const ALL_BUILD_KEYS = [...MODULE_BUILD_KEYS, 'types'] as ['main', 'module', 'browser', 'bin', 'types'];

export const API_SPECIAL_KEYS = { api: API_BUILD_KEYS };
