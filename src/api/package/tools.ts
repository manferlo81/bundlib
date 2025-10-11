import { error } from '../errors/error'
import { invalidPkgFieldMessage } from '../errors/error-messages'
import { isDictionaryOrNullish } from '../type-check/advanced'
import type { BundlibPkgJson, PkgJsonDependencies } from './pkg-json-types'

interface InstalledPackageInfo<N extends string> {
  name: N
  version: string
}

type GetPackageInfo = <N extends string>(packageName: N) => InstalledPackageInfo<N> | null

interface PackageTools {
  raw: BundlibPkgJson
  dependencies: PkgJsonDependencies | null
  devDependencies: PkgJsonDependencies | null
  peerDependencies: PkgJsonDependencies | null
  getRuntimePackageVersion: GetPackageInfo
  getDevPackageVersion: GetPackageInfo
}

function createGetPackageVersion(dependencies: PkgJsonDependencies): GetPackageInfo {
  return (packageName) => {
    const version = dependencies[packageName]
    if (!version) return null
    return { name: packageName, version }
  }
}

export function toolsFromPackage(pkg: BundlibPkgJson): PackageTools {

  const { dependencies, devDependencies, peerDependencies } = pkg

  if (!isDictionaryOrNullish(dependencies)) {
    throw error(invalidPkgFieldMessage('dependencies', 'Object'))
  }

  if (!isDictionaryOrNullish(devDependencies)) {
    throw error(invalidPkgFieldMessage('devDependencies', 'Object'))
  }

  if (!isDictionaryOrNullish(peerDependencies)) {
    throw error(invalidPkgFieldMessage('peerDependencies', 'Object'))
  }

  const getRuntimePackageVersion = createGetPackageVersion({
    ...peerDependencies,
    ...dependencies,
  })

  const getDevPackageVersion = createGetPackageVersion({
    ...devDependencies,
    ...dependencies,
  })

  return {
    raw: pkg,
    dependencies: dependencies ?? null,
    devDependencies: devDependencies ?? null,
    peerDependencies: peerDependencies ?? null,
    getRuntimePackageVersion,
    getDevPackageVersion,
  }

}
