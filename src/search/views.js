export default {
  resultViews: [
    {
      id: 'freshwaterMeasureCard',
      title: 'Freshwater measure items',
      icon: 'bars',
      render: null,
      isDefault: true,
      factories: {
        view: 'HorizontalCard.Group',
        item: 'FreshwaterMeasureItem',
      },
    },
    {
      id: 'freshwaterSWPrioritySubstanceTable',
      title: 'Freshwater SWPrioritySubstance table',
      icon: 'table',
      render: null,
      isDefault: false,
      factories: {
        view: 'SWPrioritySubstanceTableView',
        item: 'SWPrioritySubstanceTableRowItem',
      },
    },
    {
      id: 'freshwaterGWPollutantable',
      title: 'Freshwater GWPollutant table',
      icon: 'table',
      render: null,
      isDefault: false,
      factories: {
        view: 'GWPollutantTableView',
        item: 'GWPollutantTableRowItem',
      },
    },
    {
      id: 'freshwaterSWFailingRBSP',
      title: 'Freshwater swFailingRBSP table',
      icon: 'table',
      render: null,
      isDefault: false,
      factories: {
        view: 'SWFailingRBSPTableView',
        item: 'SWFailingRBSPTableRowItem',
      },
    },
  ],
  swPrioritySubstanceTableViewParams: {
    titleField: 'title',
    urlField: 'about',
    enabled: false,
    columns: [
      {
        title: 'Priority substance',
        field: 'title',
      },
      {
        title: 'Countries',
        field: 'number_of_countries',
      },
      {
        title: 'Number of water bodies failing',
        field: 'number_of_appearances',
      },
      {
        title: 'Number of water body categories',
        field: 'number_of_categories',
      },
    ],
  },
  gwPollutantTableViewParams: {
    titleField: 'title',
    urlField: 'about',
    enabled: false,
    columns: [
      {
        title: 'Pollutant',
        field: 'title',
      },
      {
        title: 'Countries',
        field: 'number_of_countries',
      },
      {
        title: 'Area of groundwater bodies failing',
        field: 'number_of_area',
      },
    ],
  },
  swFailingRBSPTableViewParams: {
    titleField: 'title',
    urlField: 'about',
    enabled: false,
    columns: [
      {
        title: 'River Basin Specific Pollutant',
        field: 'title',
      },
      {
        title: 'Number of water bodies failing',
        field: 'number_of_appearances',
      },
      {
        title: 'Number of water body categories',
        field: 'number_of_categories',
      },
      {
        title: 'Countries',
        field: 'number_of_countries',
      },
    ],
  },
};
