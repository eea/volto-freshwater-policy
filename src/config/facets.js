import { histogramFacet, makeRange, multiTermFacet } from '@eeacms/search';
import globalSearchBaseConfig from '@eeacms/volto-globalsearch/config/global-search-base-config.js';

const facets = [
  ...globalSearchBaseConfig.facets.filter(
    (facet) => facet.field !== 'time_coverage',
  ),
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

export default {
  facets,
};
