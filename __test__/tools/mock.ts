import * as analyzePkgModule from '../../src/api/analyze/analyze'
import * as pkgToConfigsModule from '../../src/api/functions/pkg-to-configs'
import * as readPkgModule from '../../src/api/package/read-pkg'

type UnknownFunction = (...args: never[]) => unknown
type SpyOnMethodCallback<F extends UnknownFunction, R> = (mock: jest.SpyInstance<ReturnType<F>, Parameters<F>>) => R

export function spyOnMethod<O extends object, K extends keyof O, R>(object: O, method: K, callback: SpyOnMethodCallback<O[K] extends UnknownFunction ? O[K] : never, R>): R
export async function spyOnMethod<O extends object, K extends keyof O, R>(object: O, method: K, callback: SpyOnMethodCallback<O[K] extends UnknownFunction ? O[K] : never, Promise<R>>): Promise<R>
export async function spyOnMethod<O extends object, K extends keyof O, R>(object: O, method: K, callback: SpyOnMethodCallback<O[K] extends UnknownFunction ? O[K] : never, R | Promise<R>>): Promise<R> {
  const mock = jest.spyOn(object, method as never)
  try {
    return await callback(mock as never)
  } finally {
    mock.mockRestore()
  }
}

export function spyOnReadPkg<R>(callback: SpyOnMethodCallback<typeof readPkgModule.readPkg, R>): R {
  return spyOnMethod(
    readPkgModule,
    'readPkg',
    callback,
  )
}

export function spyOnAnalyzePkg<R>(callback: SpyOnMethodCallback<typeof analyzePkgModule.analyzePkg, R>): R {
  return spyOnMethod(
    analyzePkgModule,
    'analyzePkg',
    callback,
  )
}

export function spyOnPkgToConfigs<R>(callback: SpyOnMethodCallback<typeof pkgToConfigsModule.pkgToConfigs, R>): R {
  return spyOnMethod(
    pkgToConfigsModule,
    'pkgToConfigs',
    callback,
  )
}
