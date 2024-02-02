import installResourceCatalogSearch from './config-catalog';
import ResourceCatalogItem from '../../components/Result/ResourceCatalogItem';

const applyConfig = (config) => {
  config.settings.searchlib = installResourceCatalogSearch(
    config.settings.searchlib,
  );

  const {
    resolve,
    searchui: { resourceCatalog },
  } = config.settings.searchlib;

  resolve.ResourceCatalogItem = {
    component: ResourceCatalogItem,
  };

  resourceCatalog.elastic_index = '_es/freshwatermeasure';
  resourceCatalog.index_name = 'wisetest_searchui';

  return config;
};

export default applyConfig;
