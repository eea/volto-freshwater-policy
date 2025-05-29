export const NWRMBenefitsTableBlockSchema = () => ({
  title: 'NWRM Benefits table block',

  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['sector', 'benefit', 'variation'],
    },
  ],

  properties: {
    sector: {
      title: 'Sector',
      choices: [
        ['Agriculture', 'Agriculture'],
        ['Forest', 'Forest'],
        ['Urban', 'Urban'],
        ['Hydromorphology', 'Hydromorphology'],
      ],
      // default: 'uwwt_profile',
    },
    benefit: {
      title: 'Benefit',
      choices: [
        ['biophysical_impacts', 'Biophysical Impacts'],
        ['ecosystem_services', 'Ecosystem Services'],
        ['policy_objectives', 'EU Policy Objective'],
      ],
      // default: 'uwwt_profile',
    },
    variation: {
      title: 'Variation',
      choices: [
        ['circle', 'Circle'],
        ['fill', 'Fill'],
      ],
      // default: 'uwwt_profile',
    },
  },

  required: ['sector', 'benefit'],
});

export default NWRMBenefitsTableBlockSchema;
