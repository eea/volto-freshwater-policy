const PageBannerActionsSchema = () => ({
  title: 'Page banner actions',

  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['hideShareButton', 'hideDownloadButton'],
    },
  ],

  properties: {
    hideShareButton: {
      title: 'Hide share button',
      type: 'boolean',
      default: false,
    },
    hideDownloadButton: {
      title: 'Hide download button',
      type: 'boolean',
      default: false,
    },
  },

  required: [],
});

export default PageBannerActionsSchema;
