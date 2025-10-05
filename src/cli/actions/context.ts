import type { ActionContext } from './action-types';

export function createActionContext(extension: Partial<ActionContext> = {}): ActionContext {
  return {
    consoleLog: console.log,
    consoleInfo: console.info,
    consoleWarn: console.warn,
    consoleError: console.error,
    ...extension,
  };
}
