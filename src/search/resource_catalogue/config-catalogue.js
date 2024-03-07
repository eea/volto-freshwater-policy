import { mergeConfig } from '@eeacms/search';
import { build_runtime_mappings } from '@eeacms/volto-globalsearch/utils';

import facets from './facets-catalogue';
import views from './views-catalogue';

const getClientProxyAddress = () => {
  const url = new URL(window.location);
  url.pathname = '';
  url.search = '';
  return url.toString();
};

const fwCatalogConfig = {
  title: 'Freshwater Resource Catalog',
  ...facets,
  ...views,
};

export const clusters = {
  name: 'op_cluster',
  field: 'objectProvides',
  clusters: [
    {
      name: 'Dashboards',
      values: ['Dashboard'],
      defaultResultView: 'resourceCatalogItem',
    },
    {
      name: 'Maps and Charts',
      values: ['Map (interactive)'],
      defaultResultView: 'resourceCatalogItem',
    },
  ],
};

export default function installResourceCatalogSearch(config) {
  const envConfig = process.env.RAZZLE_ENV_CONFIG
    ? JSON.parse(process.env.RAZZLE_ENV_CONFIG)
    : fwCatalogConfig;

  const pjson = require('../../../package.json');
  envConfig.app_name = pjson.name;
  envConfig.app_version = pjson.version;

  // for https://demo-water.devel5cph.eea.europa.eu/freshwater we use :
  //  * elastic_index: '_es/freshwatermeasure',
  //  * index_name: 'wisetest_searchui'
  config.searchui.resourceCatalog = {
    ...mergeConfig(envConfig, config.searchui.globalsearchbase),
    elastic_index: process.env.RAZZLE_ES_INDEX || '_es/globalsearch',
    index_name: process.env.RAZZLE_ES_INDEX_NAME || 'data_searchui',
    host: process.env.RAZZLE_ES_PROXY_ADDR || 'http://localhost:3000',
    runtime_mappings: build_runtime_mappings(clusters),
  };

  const { resourceCatalog } = config.searchui;

  resourceCatalog.permanentFilters.push({
    terms: {
      objectProvides: ['Dashboard', 'Map (interactive)'],
    },
  });

  resourceCatalog.contentSectionsParams = {
    enable: true,
    sectionFacetsField: 'op_cluster',
    sections: clusters.clusters,
    clusterMapping: Object.assign(
      {},
      ...clusters.clusters.map(({ name, values }) =>
        Object.assign({}, ...values.map((v) => ({ [v]: name }))),
      ),
    ),
  };

  resourceCatalog.facets = facets;

  if (typeof window !== 'undefined') {
    config.searchui.resourceCatalog.host =
      process.env.RAZZLE_ES_PROXY_ADDR || getClientProxyAddress();
  }

  return config;
}
