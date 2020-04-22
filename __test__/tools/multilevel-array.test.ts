import { flattenMultilevel } from '../../src/api/tools/multilevel-array';

describe('flattenMultilevel method', () => {

  test('Should flatten empty array', () => {
    expect(flattenMultilevel([])).toEqual([]);
  });

  test('Should flatten single level array', () => {
    expect(flattenMultilevel([1, 2, 3])).toEqual([1, 2, 3]);
  });

  test('Should flatten multi level array', () => {
    expect(flattenMultilevel<number | boolean | string>([[1, 2], true, [3, ['string', 4]]])).toEqual([1, 2, true, 3, 'string', 4]);
  });

});
