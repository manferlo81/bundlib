const { analizePkg } = require("../..");

const analize = (cwd, pkg) => pkg ? analizePkg(cwd, pkg) : analizePkg(cwd);

module.exports = analize;
