export default {
  resultViews: [
    {
      id: 'resourceCatalogItem',
      title: 'Resource cataloge items',
      icon: 'bars',
      render: null,
      isDefault: true,
      factories: {
        view: 'HorizontalCard.Group',
        item: 'ResourceCatalogItem',
      },
    },
  ],
};
