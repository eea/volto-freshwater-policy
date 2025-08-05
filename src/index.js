import { defineMessages } from 'react-intl';
import {
  DatabaseItemView,
  FavBoardView,
  FavBoardListingView,
  CaseStudyView,
  MeasureView,
  SourceView,
} from './components';

import { basket, boards } from './reducers';
import CopyrightWidget from './components/Widgets/CopyrightWidget';
import RightsWidget from './components/Widgets/RightsWidget';
import {
  BiophysicalImpactWidget,
  EcosystemServiceWidget,
  PolicyObjectiveWidget,
} from './components/Widgets/NWRMObjectListWidget';
import TokenWidget from '@plone/volto/components/manage/Widgets/TokenWidget';

import installCountryHeaderDataBlock from './components/Blocks/CountryHeaderDataBlock';
import installNWRMBenefitsTableBlock from './components/Blocks/NWRMBenefitsTable';
import installAppExtras from './components/theme/AppExtras';
import installSlatePopup from './components/Blocks/SlatePopup';
import installCaseStudyExplorer from './components/Blocks/CaseStudyExplorer';
import installSearchEngine from './search';

import { makeInlineElementPlugin } from '@plone/volto-slate/elementEditor';
import { LINK } from '@plone/volto-slate/constants';
import { LinkElement } from '@plone/volto-slate/editor/plugins/AdvancedLink/render';
import { withLink } from '@plone/volto-slate/editor/plugins/AdvancedLink/extensions';
import { linkDeserializer } from '@plone/volto-slate/editor/plugins/AdvancedLink/deserialize';
import LinkEditSchema from '@plone/volto-slate/editor/plugins/AdvancedLink/schema';
import { getBlocks } from '@plone/volto/helpers';

import linkSVG from '@plone/volto/icons/link.svg';
import ecLogo from '@eeacms/volto-freshwater-policy/../theme/assets/images/Header/logo-ec.svg';
import freshwaterLogo from '@eeacms/volto-freshwater-policy/../theme/assets/images/Header/freshwater_logo.svg';
import freshwaterWhiteLogo from '@eeacms/volto-freshwater-policy/../theme/assets/images/Header/freshwater_logo_white.svg';
import './slate-styles.less';

import { AccordionEdit, AccordionView } from './components';

const messages = defineMessages({
  edit: {
    id: 'Edit link',
    defaultMessage: 'Edit link',
  },
  delete: {
    id: 'Remove link',
    defaultMessage: 'Remove link',
  },
});

const restrictedBlocks = ['imagecards'];

const applyConfig = (config) => {
  // CSP Header
  if (__SERVER__) {
    const devsource = __DEVELOPMENT__
      ? ` http://localhost:${parseInt(process.env.PORT || '3000') + 1}`
      : '';
    config.settings.serverConfig.csp = {
      'script-src': `'self' {nonce}${devsource}`,
    };
  }

  // Multi-lingual
  config.settings.isMultilingual = false;
  config.settings.defaultLanguage =
    config.settings.eea?.defaultLanguage || 'en';

  config.settings.useQuantaToolbar = false;

  // EEA customizations
  config.settings.eea = {
    ...(config.settings.eea || {}),
    headerOpts: {
      ...(config.settings.eea?.headerOpts || {}),
      logo: freshwaterLogo,
      logoWhite: freshwaterWhiteLogo,
    },
    headerSearchBox: [
      {
        isDefault: true,
        path: config.settings.prefixPath
          ? '/freshwater/advanced-search'
          : '/advanced-search',
        placeholder: 'Search Freshwater...',
        description:
          'Looking for more information? Try searching the full EEA website content',
        buttonTitle: 'Go to advanced search',
        buttonUrl: 'https://www.eea.europa.eu/en/advanced-search',
      },
    ],
    logoTargetUrl: '/',
    organisationName: 'Freshwater Information System for Europe',
  };

  config.settings.eea.footerOpts.logosHeader = 'Managed by';
  config.settings.eea.footerOpts.managedBy[1] = {
    url: 'https://commission.europa.eu',
    src: ecLogo,
    alt: 'European commission Logo',
    className: 'commission logo',
    columnSize: {
      mobile: 6,
      tablet: 12,
      computer: 4,
    },
  };

  //toc block + columns configuration
  if (config.blocks.blocksConfig.columnsBlock) {
    config.blocks.blocksConfig.columnsBlock.tocEntries = (
      block = {},
      tocData,
    ) => {
      // integration with volto-block-toc
      const headlines = tocData.levels || ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
      let entries = [];
      const sorted_column_blocks = getBlocks(block?.data || {});
      sorted_column_blocks.forEach((column_block) => {
        const sorted_blocks = getBlocks(column_block[1]);
        sorted_blocks.forEach((block) => {
          const { value, plaintext } = block[1];
          const type = value?.[0]?.type;
          if (headlines.includes(type)) {
            entries.push([parseInt(type.slice(1)), plaintext, block[0]]);
          }
        });
      });
      return entries;
    };
  }

  //In volto 17, we expand everyting by-default. Do not expand navigation, required for fat-menu to work
  (config.settings.apiExpanders || []).forEach((item) => {
    if (item.GET_CONTENT.includes('navigation')) {
      item.GET_CONTENT.splice(item.GET_CONTENT.indexOf('navigation', 1));
    }
  });

  config.settings.eea.footerOpts.contacts = [];
  config.settings.eea.footerOpts.social = [];

  // Content type views
  config.views.contentTypesViews = {
    ...config.views.contentTypesViews,
    dashboard: DatabaseItemView,
    dataset: DatabaseItemView,
    database: DatabaseItemView,
    report_publication: DatabaseItemView,
    indicator: DatabaseItemView,
    briefing: DatabaseItemView,
    case_study: CaseStudyView,
    measure: MeasureView,
    source: SourceView,
  };

  // Block chooser
  config.blocks.groupBlocksOrder = [
    ...config.blocks.groupBlocksOrder,
    { id: 'freshwater_addons', title: 'Freshwater' },
  ];

  // Move blocks to freshwater group
  const blocksToUpdate = ['countryFlag', 'tableau_block'];
  const updatedGroup = { group: 'freshwater_addons' };

  blocksToUpdate.forEach((blockId) => {
    config.blocks.blocksConfig[blockId] = {
      ...config.blocks.blocksConfig[blockId],
      ...updatedGroup,
    };
  });

  // Move Tableau block to  Data Visualizations
  config.blocks.blocksConfig['tableau_block'] = {
    ...config.blocks.blocksConfig['tableau_block'],
    group: 'data_visualizations',
  };

  //new variation for tabs_block
  config.blocks.blocksConfig['tabs_block'].variations = [
    ...config.blocks.blocksConfig['tabs_block'].variations,
    {
      id: 'freshwater_rounded',
      title: 'Freshwater top-rounded tab',
      edit: AccordionEdit,
      view: AccordionView,
      schemaEnhancer: AccordionEdit.schemaEnhancer,
      transformWidth: 800,
    },
  ];

  // Custom block styles
  config.settings.pluggableStyles = [
    ...(config.settings.pluggableStyles || []),
    {
      id: 'uiContainer',
      title: 'Container',
      viewComponent: (props) => {
        return <div className="ui container">{props.children}</div>;
      },
    },
  ];

  // API expanders
  config.settings.apiExpanders = [
    ...config.settings.apiExpanders,
    {
      match: '/',
      GET_CONTENT: ['siblings'],
    },
  ];

  config.settings.openExternalLinkInNewTab = true;

  //this is required by volto-prefixpath
  config.settings.blackListUrls = ['/marine'];

  // Routes
  config.addonRoutes = [
    ...config.addonRoutes,
    {
      path: '/boards/boardview',
      component: FavBoardView,
    },
    {
      path: '/boards',
      component: FavBoardListingView,
    },
  ];

  config.settings.nonContentRoutes = [
    ...config.settings.nonContentRoutes,
    '/boards/boardview',
    '/boards',
  ];

  // Persistent reducers
  config.settings.persistentReducers = ['basket'];

  // Widgets
  config.widgets.id.license_copyright = CopyrightWidget;
  config.widgets.id.rights = RightsWidget;
  config.widgets.id.category = TokenWidget;
  config.widgets.id.legislative_reference = TokenWidget;
  config.widgets.id.ecosystem_services = EcosystemServiceWidget;
  config.widgets.id.biophysical_impacts = BiophysicalImpactWidget;
  config.widgets.id.policy_objectives = PolicyObjectiveWidget;

  // addonReducers
  config.addonReducers = {
    ...(config.addonReducers || {}),
    basket,
    boards,
  };

  if (__SERVER__) {
    const installExpressMiddleware = require('./express-middleware').default;
    config = installExpressMiddleware(config);
  }

  // Slate styles
  config.settings.slate = config.settings.slate || {};
  config.settings.slate.styleMenu = config.settings.slate.styleMenu || {};
  config.settings.slate.styleMenu.inlineStyles = [
    ...(config.settings.slate.styleMenu?.inlineStyles || []),
    { cssClass: 'large-text', label: 'Large text' },
    { cssClass: 'primary-big-text', label: 'Big text' },
    { cssClass: 'medium-text', label: 'Medium text' },
    { cssClass: 'small-text', label: 'Small text' },
    { cssClass: 'blue-text', label: 'Blue text' },
    { cssClass: 'blue-chart-text', label: 'Blue plot-chart text' },
    { cssClass: 'green-chart-text', label: 'Green plot-chart text' },
    { cssClass: 'yellow-chart-text', label: 'Yellow plot-chart text' },
    { cssClass: 'orange-chart-text', label: 'Orange plot-chart text' },
    { cssClass: 'red-chart-text', label: 'Red plot-chart text' },
    { cssClass: 'blue-circle text-circle', label: 'Blue circle' },
    { cssClass: 'green-circle text-circle', label: 'Green circle' },
    { cssClass: 'orange-circle text-circle', label: 'Orange circle' },
    { cssClass: 'yellow-circle text-circle', label: 'Yellow circle' },
    { cssClass: 'grey-circle text-circle', label: 'Grey circle' },
    { cssClass: 'black-text', label: 'Black text' },

    {
      cssClass: 'uwwt-empty-box blue-uwwt-background',
      label: 'UWWT blue empty box',
    },
    {
      cssClass: 'uwwt-empty-box green-uwwt-background',
      label: 'UWWT green empty box',
    },
    {
      cssClass: 'uwwt-empty-box yellow-uwwt-background',
      label: 'UWWT yellow empty box',
    },
    {
      cssClass: 'uwwt-empty-box orange-uwwt-background',
      label: 'UWWT orange empty box',
    },
    {
      cssClass: 'uwwt-empty-box red-uwwt-background',
      label: 'UWWT red empty box',
    },
  ];

  // Slate advanced link config
  const { slate } = config.settings;

  slate.toolbarButtons = [...(slate.toolbarButtons || []), LINK];
  slate.expandedToolbarButtons = [
    ...(slate.expandedToolbarButtons || []),
    LINK,
  ];

  slate.htmlTagsToSlate.A = linkDeserializer;

  const opts = {
    title: 'Link',
    pluginId: LINK,
    elementType: LINK,
    element: LinkElement,
    isInlineElement: true,
    editSchema: LinkEditSchema,
    extensions: [withLink],
    hasValue: (formData) => !!formData.link,
    toolbarButtonIcon: linkSVG,
    messages,
  };

  const [installLinkEditor] = makeInlineElementPlugin(opts);
  config = installLinkEditor(config);

  // enable plotly
  if (config.blocks.blocksConfig.plotly_chart)
    config.blocks.blocksConfig.plotly_chart.restricted = false;

  // config.settings.appExtras
  config.settings.appExtras = [
    ...config.settings.appExtras.filter((appExtra) => {
      const appExtraComponentName =
        appExtra.component?.name ||
        appExtra.component?.WrappedComponent?.name ||
        '';

      return appExtraComponentName !== 'RemoveSchema';
    }),
  ];

  // Disabled blocks
  restrictedBlocks.forEach((block) => {
    if (config.blocks.blocksConfig[block]) {
      config.blocks.blocksConfig[block].restricted = true;
    }
  });

  const final = [
    installCountryHeaderDataBlock,
    installNWRMBenefitsTableBlock,
    installAppExtras,
    installSlatePopup,
    installCaseStudyExplorer,
    installSearchEngine,
  ].reduce((acc, apply) => apply(acc), config);

  return final;
};

export default applyConfig;
