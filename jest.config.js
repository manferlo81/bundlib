const { main } = require("./package.json");

const CI = process.env.CI;

const config = {

  testEnvironment: "node",
  browser: false,

  cacheDirectory: "node_modules/.cache/jest",

  collectCoverage: true,
  collectCoverageFrom: [
    main,
  ],
  coverageDirectory: "coverage",
  coverageReporters: [
    CI ? "json" : "lcov",
    "text",
    "text-summary",
  ],

  verbose: true,

};

module.exports = config;
