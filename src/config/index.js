import { mergeConfig } from '@eeacms/search';
// import freshwaterMeasureSearchConfig from './freshwater-search-config';
import facets from './facets';
import globalSearchBaseConfig from '@eeacms/volto-globalsearch/config/global-search-base-config.js';

const getClientProxyAddress = () => {
  const url = new URL(window.location);
  url.pathname = '';
  url.search = '';
  return url.toString();
};
console.log("facets", facets);
console.log("globalSearchBaseConfig", globalSearchBaseConfig);
// debugger;

const freshwaterMeasureSearchConfig = {
  title: 'Freashwater measure search',
  ...facets,
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
    elastic_index: 'es',
    host: process.env.RAZZLE_ES_PROXY_ADDR || 'http://localhost:3000',
  };

  config.searchui.freshwatermeasure.facets = envConfig.facets;

  //   config.resolve['DatahubLandingPage'] = {
  //     component: DatahubLandingPage,
  //   };

  if (typeof window !== 'undefined') {
    config.searchui.freshwatermeasure.host =
      process.env.RAZZLE_ES_PROXY_ADDR || getClientProxyAddress();
  }

  return config;
}
