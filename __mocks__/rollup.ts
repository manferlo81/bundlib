const generate = () => ({
  output: [{ code: 'module.exports = 10' }],
});

module.exports = {
  rollup: () => ({ generate }),
};
