import { runtimeConfig } from '@plone/volto/runtime_config';
import { mergeConfig } from '@eeacms/search';
import { build_runtime_mappings } from '@eeacms/volto-globalsearch/utils';
import facets from './facets';
import views from './views';
import vocabs from './vocabulary';

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

  // for https://demo-water.devel5cph.eea.europa.eu/freshwater we use :
  //  * elastic_index: '_es/freshwatermeasure',
  //  * index_name: 'wisetest_searchui'
  config.searchui.freshwatermeasure = {
    ...mergeConfig(envConfig, config.searchui.globalsearch),
    elastic_index: runtimeConfig['RAZZLE_ES_INDEX'] || '_es/globalsearch',
    index_name: runtimeConfig['RAZZLE_ES_INDEX_NAME'] || 'data_searchui',
    host: process.env.RAZZLE_ES_PROXY_ADDR || 'http://localhost:3000',
    runtime_mappings: build_runtime_mappings(clusters),
    ...vocabs,
  };

  config.searchui.freshwatermeasure.facets = envConfig.facets;
  config.searchui.freshwatermeasure.sortOptions = [
    ...config.searchui.freshwatermeasure.sortOptions,
    {
      name: 'Number (lowest first)',
      value: 'number_of_appearances',
      direction: 'asc',
    },
    {
      name: 'Number (highest first)',
      value: 'number_of_appearances',
      direction: 'desc',
    },
    {
      name: 'Area (lowest first)',
      value: 'number_of_area',
      direction: 'asc',
    },
    {
      name: 'Area (highest first)',
      value: 'number_of_area',
      direction: 'desc',
    },
  ];
  config.searchui.freshwatermeasure.vocabs = {
    ...vocabs,
  };
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

  if (typeof window !== 'undefined') {
    config.searchui.freshwatermeasure.host =
      process.env.RAZZLE_ES_PROXY_ADDR || getClientProxyAddress();
  }

  config.searchui.freshwatermeasure.runtime_mappings['hiddenContentType'] = {
    script: {
      source:
        "if (doc['objectProvides'].contains('chemical')){emit ('true')} else {emit('false')}",
    },
    type: 'keyword',
  };

  return config;
}
