jest.mock("ora", () => {

  const returnThis = function () {
    return this;
  };

  return () => ({
    start: returnThis,
    succeed: returnThis,
    fail: returnThis,
  });

});
