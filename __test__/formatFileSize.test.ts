import { formatFileSize } from '../src/cli/tools/format';

describe('formatFileSize function', () => {

  test('Should format file size', () => {
    const cases = [
      { value: 0, expected: '0 B' },
      { value: 1, expected: '1 B' },
      { value: 1.2, expected: '1.2 B' },
      { value: 1 * 1024, expected: '1 KB' },
      { value: 1.2 * 1024, expected: '1.2 KB' },
      { value: 1.2 * 1024 * 1024, expected: '1.2 MB' },
      { value: 1200 * 1024 * 1024, expected: '1200 MB' },
    ];
    cases.forEach(({ value, expected }) => {
      const result = formatFileSize(value);
      expect(result).toBe(expected);
    });
  });

  test('Should round file size to 2 decimal places', () => {
    const cases = [
      { value: 1.231, expected: '1.23 B' },
      { value: 1.238, expected: '1.24 B' },
      { value: 1.231 * 1024, expected: '1.23 KB' },
      { value: 1.238 * 1024, expected: '1.24 KB' },
      { value: 1.231 * 1024 * 1024, expected: '1.23 MB' },
      { value: 1.238 * 1024 * 1024, expected: '1.24 MB' },
      { value: 1231.761 * 1024 * 1024, expected: '1231.76 MB' },
      { value: 1231.768 * 1024 * 1024, expected: '1231.77 MB' },
    ];
    cases.forEach(({ value, expected }) => {
      const result = formatFileSize(value);
      expect(result).toBe(expected);
    });
  });

});
