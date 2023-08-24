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
  ],
};
