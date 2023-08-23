import { mergeConfig } from '@eeacms/search';
import facets from './facets';

const getClientProxyAddress = () => {
  const url = new URL(window.location);
  url.pathname = '';
  url.search = '';
  return url.toString();
};

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
