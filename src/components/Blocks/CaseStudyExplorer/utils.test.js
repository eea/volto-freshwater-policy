import './mockJsdom';
import '@testing-library/jest-dom';
import {
  getFeatures,
  filterCases,
  getFilters,
  getSelectInteraction,
} from './utils';

describe('utils.js', () => {
  const mockCases = [
    {
      geometry: { coordinates: [0, 0] },
      properties: {
        title: 'test case study',
        image: '',
        nwrm_type: 'light',
        measures: [{ id: 'test-measure1', title: 'test measure 1' }],
        description: 'test',
        sectors: ['testsector'],
        path: '/test-case-study',
        url: 'localhost.com/test-case-study',
      },
    },
    {
      geometry: { coordinates: [0, 0] },
      properties: {
        title: 'case study 2',
        image: '',
        nwrm_type: 'light',
        measures: [{ id: 'test-measure1', title: 'test measure 1' }],
        description: 'test',
        sectors: ['testsector'],
        path: '/test-case-study',
        url: 'localhost.com/test-case-study',
      },
    },
  ];

  test('getFeatures', () => {
    const mockFeature = {
      setId: jest.fn(),
      setProperties: jest.fn(),
    };

    const ol = {
      ol: {
        Feature: jest.fn().mockImplementation(() => mockFeature),
      },
      geom: {
        Point: jest.fn().mockImplementation(() => ({})),
      },
      proj: {
        fromLonLat: jest.fn().mockReturnValue([0, 0]),
      },
    };

    expect(() => {
      getFeatures({ cases: mockCases, ol });
    }).not.toThrowError();
  });

  test('getSelectInteraction finds the Select interaction by getFeatures', () => {
    const selectInteraction = { getFeatures: jest.fn() };
    const map = {
      getInteractions: () => ({
        array_: [{ getFeatures: null }, {}, selectInteraction],
      }),
    };

    expect(getSelectInteraction(map)).toBe(selectInteraction);
  });

  test('getSelectInteraction returns undefined when no Select interaction', () => {
    const map = {
      getInteractions: () => ({ array_: [{}, {}] }),
    };

    expect(getSelectInteraction(map)).toBeUndefined();
    expect(getSelectInteraction(undefined)).toBeUndefined();
  });

  test('filterCases', () => {
    const mockActiveFilters = {
      nwrms_implemented: ['test measure 1'],
      sectors: ['testsector'],
    };
    const mockCaseStudiesIds = ['test-case-study'];
    const mockCasesFiltered = filterCases(
      mockCases,
      mockActiveFilters,
      mockCaseStudiesIds,
      'test',
    );
    expect(mockCasesFiltered).toStrictEqual([]);
  });

  test('getFilters', () => {
    const mockCasesObject = mockCases.reduce((acc, item, index) => {
      acc[index] = item;
      return acc;
    }, {});

    const mockFilters = getFilters(mockCasesObject);
    expect(mockFilters).toStrictEqual({
      nwrms_implemented: { 'test-measure1': 'test measure 1' },
      sectors: { testsector: 'testsector' },
    });
  });
});
