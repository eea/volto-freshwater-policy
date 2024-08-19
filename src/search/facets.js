import {
  histogramFacet,
  makeRange,
  multiTermFacet,
  singleTermFacet,
} from '@eeacms/search';
import globalSearchBaseConfig from '@eeacms/volto-globalsearch/config/global-search-base-config.js';
import spatialWhitelist from '@eeacms/volto-globalsearch/config/json/spatialWhitelist';
import spatialBlacklist from './json/spatialBlacklist.json';
import pollutantBlackslist from './json/pollutantBlacklist.json';

const countryCodes = [
  'EU27', // 'EU 27 Countries',
  'AT', // 'Austria',
  'BE', // 'Belgium',
  'BG', // 'Bulgaria',
  'HR', // 'Croatia',
  'CY', // 'Cyprus',
  'CZ', // 'Czechia',
  'DK', // 'Denmark',
  'EE', // 'Estonia',
  'FI', // 'Finland',
  'FR', // 'France',
  'DE', // 'Germany',
  'EL', // 'Greece',
  'HU', // 'Hungary',
  'IE', // 'Ireland',
  'IS', // 'Iceland',
  'IT', // 'Italy',
  'LT', // 'Lithuania',
  'LU', // 'Luxembourg',
  'LV', // 'Latvia',
  'MT', // 'Malta',
  'NL', // 'Netherlands',
  'NO', // 'Norway',
  'PL', // 'Poland',
  'PT', // 'Portugal',
  'RO', // 'Romania',
  'ES', // 'Spain',
  'SK', // 'Slovakia',
  'SI', // 'Slovenia',
  'SE', // 'Sweden',
  'UK', // 'United Kingdom',
];

const facets = [
  ...globalSearchBaseConfig.facets.filter(
    (facet) =>
      facet.field !== 'time_coverage' &&
      facet.field !== 'spatial' &&
      facet.field !== 'issued.date',
  ),
  multiTermFacet({
    field: 'title.eea_title',
    isFilterable: true,
    isMulti: true,
    label: 'Substance',
    iconsFamily: 'Sources',
    alwaysVisible: true,
    blacklist: pollutantBlackslist,
  }),
  multiTermFacet({
    field: 'title.index',
    isFilterable: true,
    isMulti: true,
    label: 'Pollutant',
    iconsFamily: 'Sources',
    alwaysVisible: true,
    blacklist: pollutantBlackslist,
  }),
  singleTermFacet({
    field: 'country.keyword',
    isFilterable: false,
    isMulti: false,
    label: 'Country',
    iconsFamily: 'Sources',
    alwaysVisible: true,
    sortOn: 'custom',
    sortOrder: 'ascending',
    facetValues: countryCodes,
    // hideActiveFilters: true,
    // hideRemoveFilter: true,
    // allow_missing: false,
    // missing: {
    //   values: ['EU27'],
    // },
    // default: {
    //   values: ['EU27'],
    // },
  }),
  singleTermFacet({
    field: 'management_plan.keyword',
    isFilterable: false,
    isMulti: false,
    label: 'River Basin Management Plan',
    iconsFamily: 'Sources',
    alwaysVisible: true,
    // hideActiveFilters: true,
    // hideRemoveFilter: true,
    // missing: {
    //   values: ['3rd'],
    // },
    // default: {
    //   values: ['3rd'],
    // },
  }),
  multiTermFacet({
    field: 'chemical_type.keyword',
    isFilterable: true,
    isMulti: true,
    label: 'Chemical type',
    iconsFamily: 'Sources',
    alwaysVisible: true,
  }),
  multiTermFacet({
    field: 'measure_sector.keyword',
    isFilterable: false,
    isMulti: true,
    label: 'Sector',
    iconsFamily: 'Sources',
    alwaysVisible: true,
  }),
  multiTermFacet({
    field: 'ecosystem_services.keyword',
    isFilterable: false,
    isMulti: true,
    label: 'Ecosystem services',
    iconsFamily: 'Sources',
    alwaysVisible: true,
  }),
  multiTermFacet({
    field: 'biophysical_impacts.keyword',
    isFilterable: false,
    isMulti: true,
    label: 'Biophysical impacts',
    iconsFamily: 'Sources',
    alwaysVisible: true,
  }),
  multiTermFacet({
    field: 'policy_objectives.keyword',
    isFilterable: false,
    isMulti: true,
    label: 'Policy objectives',
    iconsFamily: 'Sources',
    alwaysVisible: true,
  }),
  multiTermFacet({
    field: 'category.keyword',
    isFilterable: false,
    isMulti: true,
    label: 'WISE topics',
    iconsFamily: 'WISE topics',
    alwaysVisible: false,
  }),
  multiTermFacet({
    field: 'legislative_reference.keyword',
    isFilterable: false,
    isMulti: true,
    label: 'Reference legislations',
    iconsFamily: 'Reference legislations',
    alwaysVisible: false,
  }),
  multiTermFacet({
    field: 'spatial',
    isFilterable: true,
    isMulti: true,
    label: 'Countries',
    blacklist: spatialBlacklist,
    spatialWhitelist: spatialWhitelist,
    show: 10000,
    iconsFamily: 'Countries',
    enableExact: true,
    sortOn: 'value',
    sortOrder: 'ascending',
    alwaysVisible: false,
  }),
  histogramFacet({
    field: 'time_coverage',
    isMulti: true,
    label: 'Time coverage',
    // TODO: implement split in buckets
    ranges: makeRange({
      step: 1,
      normalRange: [2000, new Date().getFullYear() + 1],
      includeOutlierStart: false,
      includeOutlierEnd: false,
    }),
    step: 1,
    // isFilterable: false,
    aggs_script:
      "def vals = doc['time_coverage']; if (vals.length == 0){return 2500} else {def ret = [];for (val in vals){def tmp_val = val.substring(0,4);ret.add(tmp_val.toLowerCase() == tmp_val.toUpperCase() ? Integer.parseInt(tmp_val) : 2500);}return ret;}",
  }),
];

const allFacets = {
  facets,
};

export default allFacets;
