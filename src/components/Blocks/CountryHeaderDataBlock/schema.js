export const CountryHeaderDataBlockSchema = () => ({
  title: 'Country header data block',

  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['country_flag', 'hide_country_flag_section'],
    },
    {
      id: 'data',
      title: 'Data source',
      fields: [
        'variation',
        'provider_url',
        'column_data',
        'description',
        'hide_data_section',
      ],
    },
  ],

  properties: {
    variation: {
      title: 'Variation',
      choices: [
        ['wr_profile', 'WR country profile'],
        ['uwwt_profile', 'UWWT country profile'],
      ],
      default: 'uwwt_profile',
    },
    provider_url: {
      widget: 'pick_object',
      title: 'Data provider',
    },
    column_data: {
      title: 'Columns',
      choices: [],
    },
    description: {
      title: 'Description',
      widget: 'textarea',
    },
    country_flag: {
      title: 'Country flag',
      choices: [],
    },
    hide_country_flag_section: {
      type: 'boolean',
      title: 'Hide country flag section',
    },
    hide_data_section: {
      type: 'boolean',
      title: 'Hide data section',
    },
  },

  required: ['variation'],
});

export default CountryHeaderDataBlockSchema;
