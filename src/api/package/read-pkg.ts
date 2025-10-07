import loadJsonFile from 'load-json-file'
import { join as pathJoin } from 'node:path'
import { error } from '../errors/error'
import { isDictionary } from '../type-check/basic'
import type { BundlibPkgJson } from './pkg-json-types'

export async function readPkg(cwd: string): Promise<BundlibPkgJson> {

  // Load package.json file content
  const pkg = await loadJsonFile(pathJoin(cwd, 'package.json'))

  // throw error if package.json contents anything other than an object
  if (!isDictionary(pkg)) {
    throw error('Invalid package.json content')
  }

  // return file content
  return pkg

}
