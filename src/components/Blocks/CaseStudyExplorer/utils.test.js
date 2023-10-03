import './mockJsdom';
import '@testing-library/jest-dom/extend-expect';
import { filterCases } from './utils';

test('filterCases', () => {
  const mockCases = filterCases([], [], [], '');
  expect(mockCases).toStrictEqual([]);
});
