import React from 'react';
import { Grid } from 'semantic-ui-react'; // Dropdown,
import { addAppURL } from '@plone/volto/helpers';

import CaseStudyMap from './CaseStudyMap';
import { ActiveFilters, CaseStudyFilters } from './CaseStudyFilters';
// import CaseStudyList from './CaseStudyListing';

import { filterCases, getFilters } from './utils';
import { useCases } from './hooks';

import './styles.less';

const cases_url = '@@case-studies-map.arcgis.json';

export default function CaseStudyExplorerView(props) {
  let cases = useCases(addAppURL(cases_url));
  const { caseStudiesIds } = props; // case studies from measure view
  const [selectedCase, onSelectedCase] = React.useState();
  const hideFilters = caseStudiesIds ? true : false;
  const mapColumnSize = 12;

  const [activeFilters, setActiveFilters] = React.useState({
    // nwrm_type: [],
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
    // activeFilters.nwrm_type,
    activeFilters.nwrms_implemented,
    activeFilters.sectors,
    activeItems.length,
  ]);

  React.useEffect(() => {
    let activeItems = filterCases(cases, activeFilters, caseStudiesIds);

    setActiveItems(activeItems);
  }, [caseStudiesIds, activeFilters, cases]);

  if (__SERVER__) return '';

  return (
    <div className="searchlib-block">
      <Grid.Row>
        {hideFilters ? null : (
          <ActiveFilters
            filters={filters}
            activeFilters={activeFilters}
            setActiveFilters={setActiveFilters}
          />
        )}
      </Grid.Row>
      <Grid.Row
        // mobile={3}
        // tablet={3}
        // computer={2}
        stretched={true}
        id="cse-filter"
      >
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
            <Grid.Column
              mobile={mapColumnSize}
              tablet={mapColumnSize}
              computer={mapColumnSize}
            >
              <CaseStudyMap
                items={cases}
                activeItems={activeItems}
                hideFilters={hideFilters}
                selectedCase={selectedCase}
                onSelectedCase={onSelectedCase}
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
