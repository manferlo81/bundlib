// @ts-check

const { configsFromPkg } = require("../..");

/**
 * @param { string } cwd
 * @param { boolean } dev
 * @param { import("../../types").BundlibPkgJson } [pkgJson]
 */
async function createConfigs(cwd, dev, pkgJson) {
  return pkgJson ? configsFromPkg(cwd, dev, pkgJson) : configsFromPkg(cwd, dev);
}

module.exports = createConfigs;
