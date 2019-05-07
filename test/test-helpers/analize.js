const { analizePkg } = require("../..");

const analize = (cwd, options) => options ? analizePkg(cwd, options) : analizePkg(cwd);

module.exports = analize;
