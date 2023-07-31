import { defineMessages } from 'react-intl';
import {
  DatabaseItemView,
  MetadataListingView,
  SimpleListingView,
  FavBoardView,
  FavBoardListingView,
  CaseStudyView,
  MeasureView,
  SourceView,
} from './components';

import { basket, boards } from './reducers';
import CopyrightWidget from './components/Widgets/CopyrightWidget';
import TokenWidget from '@plone/volto/components/manage/Widgets/TokenWidget';

import installCountryHeaderDataBlock from './components/Blocks/CountryHeaderDataBlock';
import installCountriesListingBlock from './components/Blocks/CountriesListingBlock';
import installEmbedContentBlock from './components/Blocks/Content';
import installDashboardTabsBlock from './components/Blocks/DashboardTabsBlock';
import installCustomCardsBlock from './components/Blocks/CustomCardsBlock';
import installAppExtras from './components/theme/AppExtras';
import installSlatePopup from './components/Blocks/SlatePopup';
import installCaseStudyExplorer from './components/Blocks/CaseStudyExplorer';

import customBlockTemplates from './components/Blocks/CustomBlockTemplates/customBlockTemplates';

import freshwaterLogo from '@eeacms/volto-freshwater-policy/../theme/assets/images/Header/freshwater_logo.svg';
import freshwaterWhiteLogo from '@eeacms/volto-freshwater-policy/../theme/assets/images/Header/freshwater_logo_white.svg';

import linkSVG from '@plone/volto/icons/link.svg';
import { makeInlineElementPlugin } from '@plone/volto-slate/elementEditor';
import { LINK } from '@plone/volto-slate/constants';
import { LinkElement } from '@plone/volto-slate/editor/plugins/AdvancedLink/render';
import { withLink } from '@plone/volto-slate/editor/plugins/AdvancedLink/extensions';
import { linkDeserializer } from '@plone/volto-slate/editor/plugins/AdvancedLink/deserialize';
import LinkEditSchema from '@plone/volto-slate/editor/plugins/AdvancedLink/schema';
import ecLogo from '@eeacms/volto-freshwater-policy/../theme/assets/images/Header/logo-ec.svg';

import './slate-styles.less';

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

const applyConfig = (config) => {
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
        path: '/freshwater/advanced-search',
        placeholder: 'Search Freshwater...',
        description:
          'Looking for more information? Try searching the full EEA website content',
        buttonTitle: 'Go to advanced search',
        buttonUrl: 'https://www.eea.europa.eu/en/advanced-search',
      },
    ],
    logoTargetUrl: '/',
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
    map_interactive: DatabaseItemView,
    case_study: CaseStudyView,
    measure: MeasureView,
    source: SourceView,
  };

  config.blocks = {
    ...config.blocks,
    blocksConfig: { ...customBlockTemplates(config) },
  };

  // Block chooser
  config.blocks.groupBlocksOrder = [
    ...config.blocks.groupBlocksOrder,
    { id: 'freshwater_addons', title: 'Freshwater' },
  ];

  // Search block metadata listing view
  config.blocks.blocksConfig.listing = {
    ...config.blocks.blocksConfig.listing,
    variations: [
      ...config.blocks.blocksConfig.listing.variations,
      {
        id: 'metadata',
        title: 'Metadata Listing',
        template: MetadataListingView,
        isDefault: false,
      },
      {
        id: 'simple',
        title: 'Simple Listing',
        template: SimpleListingView,
        isDefault: false,
      },
    ],
  };

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

  config.settings.externalRoutes = [
    ...(config.settings.externalRoutes || []),
    ...(config.settings.prefixPath
      ? [
          {
            match: {
              path: /\/$/,
              exact: true,
              strict: true,
            },

            url(payload) {
              return payload.location.pathname;
            },
          },
        ]
      : []),
  ];

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
  config.widgets.id.category = TokenWidget;

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
  config.settings.slate.styleMenu = config.settings.slate.styleMenu || {};
  config.settings.slate.styleMenu.inlineStyles = [
    ...(config.settings.slate.styleMenu?.inlineStyles || []),
    { cssClass: 'blue-text', label: 'Blue text' },
    { cssClass: 'blue-chart-text', label: 'Blue plot-chart text' },
    { cssClass: 'green-chart-text', label: 'Green plot-chart text' },
    { cssClass: 'yellow-chart-text', label: 'Yellow plot-chart text' },
    { cssClass: 'orange-chart-text', label: 'Orange plot-chart text' },
    { cssClass: 'blue-circle text-circle', label: 'Blue circle' },
    { cssClass: 'green-circle text-circle', label: 'Green circle' },
    { cssClass: 'orange-circle text-circle', label: 'Orange circle' },
    { cssClass: 'yellow-circle text-circle', label: 'Yellow circle' },
    { cssClass: 'grey-circle text-circle', label: 'Grey circle' },
    { cssClass: 'black-text', label: 'Black text' },
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

  const final = [
    installEmbedContentBlock,
    installDashboardTabsBlock,
    installCustomCardsBlock,
    installCountryHeaderDataBlock,
    installCountriesListingBlock,
    installAppExtras,
    installSlatePopup,
    installCaseStudyExplorer,
  ].reduce((acc, apply) => apply(acc), config);

  return final;
};

export default applyConfig;
