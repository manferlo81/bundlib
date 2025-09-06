import { normalizeRollupInterop } from '../../src/api/options/interop';

test('should normalize interop option before send it to rollup', () => {
  // Rollup doesn't support boolean interop anymore
  expect(normalizeRollupInterop(true)).toBe('compat');
  expect(normalizeRollupInterop(false)).toBe('default');
  // Supported values should be preserved
  expect(normalizeRollupInterop('auto')).toBe('auto');
  expect(normalizeRollupInterop('compat')).toBe('compat');
  expect(normalizeRollupInterop('default')).toBe('default');
  expect(normalizeRollupInterop('defaultOnly')).toBe('defaultOnly');
  expect(normalizeRollupInterop('esModule')).toBe('esModule');
});
