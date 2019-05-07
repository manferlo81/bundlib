jest.mock("fs", () => {

  let fs = jest.requireActual("fs");

  function writeFileSync() { }

  function writeFile(filename, content, callback) {
    setImmediate(() => {
      writeFileSync(filename, content);
      callback(null);
    });
  }

  return { ...fs, writeFileSync, writeFile };

});
