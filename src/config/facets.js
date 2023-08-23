import { multiTermFacet } from '@eeacms/search';

import globalSearchBaseConfig from '@eeacms/volto-globalsearch/config/global-search-base-config.js';

const facets = [
  ...globalSearchBaseConfig.facets,
  multiTermFacet({
    field: 'measure_sector.keyword',
    isFilterable: false,
    isMulti: true,
    label: 'Sector',
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
    field: 'ecosystem_services.keyword',
    isFilterable: false,
    isMulti: true,
    label: 'Ecosystem services',
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
];

export default {
  facets,
};
