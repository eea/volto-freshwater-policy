import installResourceCatalogSearch from './config-catalog';
import ResourceCatalogItem from '../../components/Result/ResourceCatalogItem';

const applyConfig = (config) => {
  config.settings.searchlib = installResourceCatalogSearch(
    config.settings.searchlib,
  );

  const { resolve } = config.settings.searchlib;

  resolve.ResourceCatalogItem = {
    component: ResourceCatalogItem,
  };

  return config;
};

export default applyConfig;
