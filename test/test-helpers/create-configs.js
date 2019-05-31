const analize = require("./analize");
const { pkgToConfigs } = require("../..");

async function createConfigs(cwd, dev, pkgJson) {
  const pkg = await analize(cwd, pkgJson);
  return pkgToConfigs(pkg, dev);
}

module.exports = createConfigs;
