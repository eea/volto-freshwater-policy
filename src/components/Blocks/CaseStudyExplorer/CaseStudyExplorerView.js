import React from 'react';
import { Grid } from 'semantic-ui-react'; // Dropdown,
import { addAppURL } from '@plone/volto/helpers';

import CaseStudyMap from './CaseStudyMap';
import { ActiveFilters, CaseStudyFilters, SearchBox } from './CaseStudyFilters';
// import CaseStudyList from './CaseStudyListing';

import { filterCases, getFilters } from './utils';
import { useCases } from './hooks';

import './styles.less';

const cases_url = '@@case-studies-map.arcgis.json';

export default function CaseStudyExplorerView(props) {
  let cases = useCases(addAppURL(cases_url));
  const { caseStudiesIds } = props; // case studies from measure view
  const [selectedCase, onSelectedCase] = React.useState();
  const [searchInput, setSearchInput] = React.useState('');
  const hideFilters = caseStudiesIds ? true : false;

  const [activeFilters, setActiveFilters] = React.useState({
    nwrms_implemented: [],
    sectors: [],
  });

  const [activeItems, setActiveItems] = React.useState(cases);
  const [filters, setFilters] = React.useState([]);

  React.useEffect(() => {
    const _filters = getFilters(cases);
    setFilters(_filters);
  }, [
    cases,
    activeFilters.nwrms_implemented,
    activeFilters.sectors,
    activeItems.length,
  ]);

  React.useEffect(() => {
    let activeItems = filterCases(
      cases,
      activeFilters,
      caseStudiesIds,
      searchInput,
    );

    setActiveItems(activeItems);
  }, [caseStudiesIds, activeFilters, cases, searchInput]);

  if (__SERVER__) return '';

  return (
    <div className="searchlib-block">
      <Grid.Row>
        {hideFilters ? null : (
          <SearchBox
            filters={filters}
            activeFilters={activeFilters}
            setActiveFilters={setActiveFilters}
            searchInput={searchInput}
            setSearchInput={setSearchInput}
          />
        )}
      </Grid.Row>
      <Grid.Row>
        {hideFilters ? null : (
          <ActiveFilters
            filters={filters}
            activeFilters={activeFilters}
            setActiveFilters={setActiveFilters}
          />
        )}
      </Grid.Row>
      <Grid.Row stretched={true} id="cse-filter">
        {hideFilters ? null : (
          <CaseStudyFilters
            filters={filters}
            activeFilters={activeFilters}
            setActiveFilters={setActiveFilters}
          />
        )}
      </Grid.Row>
      <Grid.Row>
        {cases.length ? (
          <Grid columns={12}>
            <Grid.Column mobile={12} tablet={12} computer={12}>
              <CaseStudyMap
                items={cases}
                activeItems={activeItems}
                hideFilters={hideFilters}
                selectedCase={selectedCase}
                onSelectedCase={onSelectedCase}
                searchInput={searchInput}
              />
            </Grid.Column>
            {/* {hideFilters ? null : (
              <Grid.Column mobile={4} tablet={4} computer={4}>
                <div id="external-popup-overlay"></div>
              </Grid.Column>
            )} */}
          </Grid>
        ) : null}
      </Grid.Row>
      {/* <Grid.Row>
        {hideFilters ? null : (
          <CaseStudyList
            activeItems={activeItems}
            selectedCase={selectedCase}
            onSelectedCase={onSelectedCase}
          />
        )}
      </Grid.Row> */}
    </div>
  );
}
