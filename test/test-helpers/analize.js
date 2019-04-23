const { analizePkg } = require("../..");

const cwd = process.cwd();
const analize = (options) => options ? analizePkg(cwd, options) : analizePkg(cwd);

module.exports = analize;
