module.exports = {

  testEnvironment: "node",

  collectCoverage: true,
  collectCoverageFrom: [
    "dist/**",
  ],
  coverageDirectory: "coverage",
  coverageReporters: [
    "lcov",
    "text",
  ],

  verbose: true,

};
