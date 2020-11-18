import { error } from './error';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fmt<T extends (...args: any[]) => TypeError>(template: string): T {
  return (
    (...args: string[]) => error(
      template.replace(/\$\{([0-9]+)\}/g, (_, i) => args[+i]),
    )
  ) as T;
}
