import cloneDeep from 'lodash.clonedeep';

import globalSearchBaseConfig from '@eeacms/volto-globalsearch/config/global-search-base-config.js';

import facets from './facets';

let freshwaterMeasureSearchConfig = cloneDeep(globalSearchBaseConfig);
freshwaterMeasureSearchConfig.landingPageURL = '/en/advanced-search';

freshwaterMeasureSearchConfig.facets = [
  ...globalSearchBaseConfig.facets,
  ...facets,
];

export default freshwaterMeasureSearchConfig;
