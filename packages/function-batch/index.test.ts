import { printDate } from './index';

test('print date', () => {
  expect(printDate()).toBe('2020-01-02 00:00:00');
});
