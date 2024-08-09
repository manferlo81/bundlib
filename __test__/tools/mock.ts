import * as pkgToConfigsModule from '../../src/api/pkg-to-configs';
import * as readPkgModule from '../../src/api/package/read-pkg';
import * as analyzePkgModule from '../../src/api/analyze/analyze';

type UnknownFunction = (...args: never[]) => unknown;
type ModuleObject = Record<string, UnknownFunction>;
type SpyOnMethodCallback<F extends UnknownFunction, R> = (mock: jest.SpyInstance<ReturnType<F>, Parameters<F>>) => R | Promise<R>;

async function spyOnModuleMethod<M extends ModuleObject, K extends keyof M, R>(moduleObject: M, method: K, callback: SpyOnMethodCallback<M[K], R>): Promise<R> {
  const mock = jest.spyOn(moduleObject, method as never);
  const result = await callback(mock as never);
  mock.mockRestore();
  return result;
}

export async function spyOnReadPkg<R>(callback: SpyOnMethodCallback<typeof readPkgModule.readPkg, R>): Promise<R> {
  return spyOnModuleMethod(readPkgModule, 'readPkg', callback);
}

export async function spyOnAnalyzePkg<R>(callback: SpyOnMethodCallback<typeof analyzePkgModule.analyzePkg2, R>): Promise<R> {
  return spyOnModuleMethod(analyzePkgModule, 'analyzePkg2', callback);
}

export async function spyOnPkgToConfigs<R>(callback: SpyOnMethodCallback<typeof pkgToConfigsModule.pkgToConfigs, R>): Promise<R> {
  return spyOnModuleMethod(pkgToConfigsModule, 'pkgToConfigs', callback);
}
