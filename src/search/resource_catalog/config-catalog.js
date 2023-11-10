import { mergeConfig } from '@eeacms/search';

import facets from './facets-catalog';

const getClientProxyAddress = () => {
  const url = new URL(window.location);
  url.pathname = '';
  url.search = '';
  return url.toString();
};

const fwCatalogConfig = {
  title: 'Freshwater Resource Catalog',
  ...facets,
  //   ...views,
};

export default function installResourceCatalogSearch(config) {
  const envConfig = process.env.RAZZLE_ENV_CONFIG
    ? JSON.parse(process.env.RAZZLE_ENV_CONFIG)
    : fwCatalogConfig;

  const pjson = require('../../../package.json');
  envConfig.app_name = pjson.name;
  envConfig.app_version = pjson.version;

  config.searchui.resourceCatalog = {
    ...mergeConfig(envConfig, config.searchui.globalsearchbase),
    elastic_index: 'es',
    host: process.env.RAZZLE_ES_PROXY_ADDR || 'http://localhost:3000',
  };

  const { resourceCatalog } = config.searchui;

  resourceCatalog.permanentFilters.push({
    terms: {
      objectProvides: [
        'Dashboard',
        'Map (interactive)',
        'Indicator',
        'Report/Publication',
        'Visualization (Tableau)',
      ],
    },
  });

  resourceCatalog.facets = facets;

  if (typeof window !== 'undefined') {
    config.searchui.resourceCatalog.host =
      process.env.RAZZLE_ES_PROXY_ADDR || getClientProxyAddress();
  }

  return config;
}
