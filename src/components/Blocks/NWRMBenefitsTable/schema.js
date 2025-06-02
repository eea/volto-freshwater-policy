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
      default: 'Agriculture',
    },
    benefit: {
      title: 'Benefit',
      choices: [
        ['biophysical_impacts', 'Biophysical Impacts'],
        ['ecosystem_services', 'Ecosystem Services'],
        ['policy_objectives', 'EU Policy Objective'],
      ],
      default: 'biophysical_impacts',
    },
    variation: {
      title: 'Variation',
      choices: [
        ['circle', 'Circle'],
        ['fill', 'Fill'],
      ],
      default: 'Circle',
    },
  },

  required: ['sector', 'benefit'],
});

export default NWRMBenefitsTableBlockSchema;
