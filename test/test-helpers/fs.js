const { existsSync, unlinkSync } = require("fs");

exports.cleanup = (files) => {

  files.forEach((filename) => {
    existsSync(filename) && unlinkSync(filename);
  });

};

exports.exist = (files) => {

  files.map((filename) => {
    expect(existsSync(filename)).toBe(true);
  });

};
