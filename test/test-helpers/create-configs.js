const analize = require("./analize");
const { pkgToConfigs } = require("../..");

async function createConfigs(cwd, dev, pkgjson) {
  const pkg = pkgjson ? await analize(cwd, pkgjson) : await analize(cwd);
  return pkgToConfigs(pkg, {
    dev,
  });
}

module.exports = createConfigs;
