import './mockJsdom';
import '@testing-library/jest-dom/extend-expect';
import { filterCases, getFilters } from './utils';

test('filterCases', () => {
  const mockCases = filterCases([], [], [], '');
  expect(mockCases).toStrictEqual([]);
});

test('getFilters', () => {
  const mockFilters = getFilters([]);
  expect(mockFilters).toStrictEqual({
    nwrms_implemented: {},
    sectors: {},
  });
});
