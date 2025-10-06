import type { BundlibPkgJson } from '../package/pkg-json-types';
import { readPkg } from '../package/read-pkg';
import { analyzePkg } from './analyze';
import type { PkgAnalyzed } from './pkg-analyzed';

// this function is here for compatibility reasons
// to warn the user about the new function signature
// the second argument is now REQUIRED
// TODO: In the future this function will be removed and it will be replaced by analyzePkg function
export async function compatibilityAnalyzePkg(cwd: string, inputPkg?: BundlibPkgJson): Promise<PkgAnalyzed> {
  // call new function if second argument provided
  if (inputPkg) return analyzePkg(cwd, inputPkg);

  // warn the user about package.json content not being passed
  console.warn('Function analyzePkg should receive package.json content. Please use readPkg to get it and pass it to analyzePkg. We will do it for you this time. This warning will become an error in the future.');

  // read package.json and call the the new function
  const pkg = await readPkg(cwd);
  return analyzePkg(cwd, pkg);
}
