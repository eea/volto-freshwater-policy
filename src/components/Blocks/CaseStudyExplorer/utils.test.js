import './mockJsdom';
// import React from 'react';
import '@testing-library/jest-dom/extend-expect';
// import { render } from '@testing-library/react';
import { filterCases } from './utils';

test('filterCases', () => {
  const mockCases = filterCases([], [], [], '');
  expect(mockCases).toStrictEqual([]);
});
