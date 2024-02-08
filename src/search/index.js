import installMainSearch from './config';
import installResourceCatalogSearch from './resource_catalogue/config-catalogue';

import FreshwaterMeasureItem from '../components/Result/FreshwaterMeasureItem';
import ResourceCatalogItem from '../components/Result/ResourceCatalogItem';

const applyConfig = (config) => {
  config.settings.searchlib = installMainSearch(config.settings.searchlib);

  config.settings.searchlib = installResourceCatalogSearch(
    config.settings.searchlib,
  );

  const { resolve } = config.settings.searchlib;

  resolve.ResourceCatalogItem = {
    component: ResourceCatalogItem,
  };

  resolve.FreshwaterMeasureItem = { component: FreshwaterMeasureItem };

  const freshwatermeasureConfig =
    config.settings.searchlib.searchui.freshwatermeasure;
  const index = freshwatermeasureConfig.permanentFilters.findIndex(
    (f) => f.id === 'constantScore',
  );
  const baseConstantScore = freshwatermeasureConfig.permanentFilters[index];

  function updatedConstantScore() {
    const base = baseConstantScore();
    let filterBool = base.constant_score.filter.bool;

    if (filterBool) {
      if (!Array.isArray(filterBool.must_not)) {
        if (
          filterBool.must_not?.exists?.field === 'exclude_from_globalsearch'
        ) {
          delete filterBool.must_not;
        }
      } else {
        filterBool.must_not = filterBool.must_not.filter((item) => {
          if (item?.exists?.field === 'exclude_from_globalsearch') {
            return false;
          }
          return true;
        });
      }
    }

    return base;
  }

  updatedConstantScore.id = 'constantScore';

  freshwatermeasureConfig.permanentFilters[index] = updatedConstantScore;

  return config;
};

export default applyConfig;
