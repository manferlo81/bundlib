// @ts-check

const analize = require("./analize");
const { pkgToConfigs } = require("../..");

/**
 * @param { string } cwd
 * @param { boolean } dev
 * @param { import("../../types").BundlibPkgJson } [pkgJson]
 */
async function createConfigs(cwd, dev, pkgJson) {
  const pkg = pkgJson ? await analize(cwd, pkgJson) : await analize(cwd);
  return pkgToConfigs(pkg, dev);
}

module.exports = createConfigs;
