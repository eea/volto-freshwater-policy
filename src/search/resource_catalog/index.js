import installResourceCatalogSearch from './config-catalog';

const applyConfig = (config) => {
  config.settings.searchlib = installResourceCatalogSearch(
    config.settings.searchlib,
  );

  const {
    searchui: { resourceCatalog },
  } = config.settings.searchlib;

  resourceCatalog.elastic_index = '_es/freshwatermeasure';
  resourceCatalog.index_name = 'wisetest_searchui';

  return config;
};

export default applyConfig;
