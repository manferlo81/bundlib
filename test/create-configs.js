// @ts-check

const analize = require("./analize");
const { pkgToConfigs } = require("..");

/**
 * @param { string } cwd
 * @param { boolean } dev
 * @param { import("..").BundlibPkgJson } pkgJson
 */
async function createConfigs(cwd, dev, pkgJson) {
  const pkg = await analize(cwd, pkgJson);
  return pkgToConfigs(pkg, dev);
}

module.exports = createConfigs;
