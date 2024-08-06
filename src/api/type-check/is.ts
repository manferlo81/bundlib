export function is(value: unknown, type: 'string'): value is string;
export function is(value: unknown, type: 'object'): value is object;
export function is(value: unknown, type: string): boolean {
  return typeof value === type;
}
