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
        title: 'Number of water bodies',
        field: 'number_of_appearances',
      },
      {
        title: 'Number of water body category',
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
        title: 'Priority substance',
        field: 'title',
      },
      {
        title: 'Countries',
        field: 'number_of_countries',
      },
      {
        title: 'Number of water bodies',
        field: 'number_of_appearances',
      },
    ],
  },
};
