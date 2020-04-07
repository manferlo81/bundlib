const result = (filename: string) => ({
  config: {},
  filename,
});

const load = () => result('mock/load/filename.json');
const search = () => result('mock/search/filename.json');

module.exports = {
  cosmiconfig: () => ({ load, search }),
};
