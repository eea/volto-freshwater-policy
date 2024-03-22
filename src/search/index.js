import installMainSearch from './config';
import installResourceCatalogSearch from './resource_catalogue/config-catalogue';

import FreshwaterMeasureItem from '../components/Result/FreshwaterMeasureItem';
import ResourceCatalogItem from '../components/Result/ResourceCatalogItem';
import SWPrioritySubstanceTableView from '../components/Result/SWPrioritySubstanceTableView';
import SWPrioritySubstanceTableRowItem from '../components/Result/SWPrioritySubstanceTableRowItem';
import GWPollutantTableView from '../components/Result/GWPollutantTableView';
import GWPollutantTableRowItem from '../components/Result/GWPollutantTableRowItem';
import SWFailingRBSPTableView from '../components/Result/SWFailingRBSPTableView';
import SWFailingRBSPTableRowItem from '../components/Result/SWFailingRBSPTableRowItem';

const getActiveFilters = (filters, appConfig) => {
  const { facets = [] } = appConfig;
  const filterableFacets = facets.filter(
    (f) =>
      f.isFilter ||
      (typeof f.showInFacetsList !== 'undefined' ? f.showInFacetsList : true),
  );
  const facetNames = filterableFacets.map((f) => f.field);
  const filterNames = filters
    .filter((f) => facetNames.includes(f.field))
    .map((f) => f.field);

  const activeFilters = filters.filter((f) => filterNames.includes(f.field));

  return activeFilters;
};

const applyConfig = (config) => {
  config.settings.searchlib = installMainSearch(config.settings.searchlib);

  config.settings.searchlib = installResourceCatalogSearch(
    config.settings.searchlib,
  );

  const { resolve } = config.settings.searchlib;

  resolve.getGlobalSearchActiveFilters = getActiveFilters;

  resolve.ResourceCatalogItem = {
    component: ResourceCatalogItem,
  };
  resolve.FreshwaterMeasureItem = { component: FreshwaterMeasureItem };
  resolve.SWPrioritySubstanceTableView = {
    component: SWPrioritySubstanceTableView,
  };
  resolve.SWPrioritySubstanceTableRowItem = {
    component: SWPrioritySubstanceTableRowItem,
  };

  resolve.GWPollutantTableView = {
    component: GWPollutantTableView,
  };
  resolve.GWPollutantTableRowItem = {
    component: GWPollutantTableRowItem,
  };

  resolve.SWFailingRBSPTableView = {
    component: SWFailingRBSPTableView,
  };
  resolve.SWFailingRBSPTableRowItem = {
    component: SWFailingRBSPTableRowItem,
  };

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
