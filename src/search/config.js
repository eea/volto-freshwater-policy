import { mergeConfig } from '@eeacms/search';
import { build_runtime_mappings } from '@eeacms/volto-globalsearch/utils';
import facets from './facets';
import views from './views';

const getClientProxyAddress = () => {
  const url = new URL(window.location);
  url.pathname = '';
  url.search = '';
  return url.toString();
};

export const clusters = {
  name: 'op_cluster',
  field: 'objectProvides',
  clusters: [
    {
      name: 'Maps and Charts',
      values: ['Map (interactive)', 'Map (simple)', 'Chart (interactive)'],
      defaultResultView: 'horizontalCard',
    },
    {
      name: 'Dashboards',
      values: ['Dashboard'],
      defaultResultView: 'horizontalCard',
    },
    {
      name: 'Web pages',
      values: ['Webpage'],
      defaultResultView: 'horizontalCard',
    },
    {
      name: 'Country factsheet',
      values: ['Country fact sheet'],
      defaultResultView: 'horizontalCard',
    },
    {
      name: 'Others',
      values: ['Glossary term', 'Case study', 'Measure'],
      defaultResultView: 'horizontalCard',
    },
  ],
};

const freshwaterMeasureSearchConfig = {
  title: 'Freashwater measure search',
  ...facets,
  ...views,
};

export default function install(config) {
  const envConfig = process.env.RAZZLE_ENV_CONFIG
    ? JSON.parse(process.env.RAZZLE_ENV_CONFIG)
    : freshwaterMeasureSearchConfig;

  const pjson = require('../../package.json');
  envConfig.app_name = pjson.name;
  envConfig.app_version = pjson.version;

  config.searchui.freshwatermeasure = {
    ...mergeConfig(envConfig, config.searchui.globalsearch),
    elastic_index: '_es/freshwatermeasure',
    index_name: 'wisetest_searchui',
    host: process.env.RAZZLE_ES_PROXY_ADDR || 'http://localhost:3000',
    runtime_mappings: build_runtime_mappings(clusters),
  };

  config.searchui.freshwatermeasure.facets = envConfig.facets;

  config.searchui.freshwatermeasure.contentSectionsParams = {
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

  console.log('s', config.searchui.freshwatermeasure);

  if (typeof window !== 'undefined') {
    config.searchui.freshwatermeasure.host =
      process.env.RAZZLE_ES_PROXY_ADDR || getClientProxyAddress();
  }

  return config;
}
