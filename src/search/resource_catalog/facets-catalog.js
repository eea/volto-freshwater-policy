import { multiTermFacet } from '@eeacms/search';

import globalSearchBaseConfig from '@eeacms/volto-globalsearch/config/global-search-base-config.js';

const facets = [
  ...globalSearchBaseConfig.facets,
  multiTermFacet({
    field: 'category.keyword',
    isFilterable: false,
    isMulti: true,
    label: 'Main Topic',
    iconsFamily: 'Main Topic',
    alwaysVisible: false,
  }),
  multiTermFacet({
    field: 'legislative_reference.keyword',
    isFilterable: false,
    isMulti: true,
    label: 'Main Reference Legislation',
    iconsFamily: 'Main Reference Legislation',
    alwaysVisible: false,
  }),
];

export default facets;
