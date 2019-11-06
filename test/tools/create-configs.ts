import { BundlibPkgJson, configsFromPkg } from '../../src/api'

async function createConfigs(cwd: string, dev: boolean, pkgJson?: BundlibPkgJson) {
  return pkgJson
    ? configsFromPkg(cwd, dev ? { dev, watch: true } : null, pkgJson)
    : configsFromPkg(cwd, { dev })
}

export default createConfigs
