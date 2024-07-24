const views = {
  resultViews: [
    {
      id: 'resourceCatalogItem',
      title: 'Resource catalogue',
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

export default views;
