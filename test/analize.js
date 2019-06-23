// @ts-check

const { analizePkg } = require("..");

/**
 * @param { string } cwd
 * @param { import("..").BundlibPkgJson } [pkg]
 */
const analize = (cwd, pkg) => pkg ? analizePkg(cwd, pkg) : analizePkg(cwd);

module.exports = analize;
