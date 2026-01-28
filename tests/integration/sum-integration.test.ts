import { sum } from '../../src/index';

describe('Integration: sum function', () => {
  test('works in array reduce', () => {
    const numbers = [1, 2, 3, 4];
    const total = numbers.reduce((acc, num) => sum(acc, num), 0);
    expect(total).toBe(10);
  });
});
