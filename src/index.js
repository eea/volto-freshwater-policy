import {
  DatabaseItemView,
  MetadataListingView,
  SimpleListingView,
  HorizontalTocView,
  FavBoardView,
  FavBoardListingView,
  CaseStudyView,
  MeasureView,
  SourceView,
} from './components';

import { basket, boards } from './reducers';
import CopyrightWidget from './components/Widgets/CopyrightWidget';
import TokenWidget from '@plone/volto/components/manage/Widgets/TokenWidget';

import installArcgisBlock from './components/Blocks/ArcgisBlock';
import installCountryHeaderDataBlock from './components/Blocks/CountryHeaderDataBlock';
import installCountriesListingBlock from './components/Blocks/CountriesListingBlock';
import installEmbedContentBlock from './components/Blocks/Content';
import installDashboardTabsBlock from './components/Blocks/DashboardTabsBlock';
import installCustomCardsBlock from './components/Blocks/CustomCardsBlock';
import installSearchBlock from './components/Blocks/SearchBlock';
import installAppExtras from './components/theme/AppExtras';
import installSlatePopup from './components/Blocks/SlatePopup';
import installCaseStudyExplorer from './components/Blocks/CaseStudyExplorer';

import customBlockTemplates from './components/Blocks/CustomBlockTemplates/customBlockTemplates';

import freshwaterLogo from '@eeacms/volto-freshwater-policy/../theme/assets/images/Header/freshwater_logo.svg';
import freshwaterWhiteLogo from '@eeacms/volto-freshwater-policy/../theme/assets/images/Header/freshwater_logo_white.svg';

const applyConfig = (config) => {
  // Multi-lingual
  config.settings.isMultilingual = false;
  config.settings.defaultLanguage =
    config.settings.eea?.defaultLanguage || 'en';

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
        path: '/advanced-search',
        placeholder: 'Search Freshwater...',
        description:
          'Looking for more information? Try searching the full EEA website content',
        buttonTitle: 'Go to advanced search',
        buttonUrl: 'https://www.eea.europa.eu/en/advanced-search',
      },
    ],
    logoTargetUrl: '/',
  };

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

  // Table of contents custom view
  config.blocks.blocksConfig.toc = {
    ...config.blocks.blocksConfig.toc,
    variations: [
      ...config.blocks.blocksConfig.toc.variations,
      {
        id: 'horizontalTocView',
        title: 'FW horizontal menu',
        view: HorizontalTocView,
        schemaExtender: null,
      },
    ],
  };

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

  const final = [
    installEmbedContentBlock,
    installDashboardTabsBlock,
    installCustomCardsBlock,
    installSearchBlock,
    installCountryHeaderDataBlock,
    installCountriesListingBlock,
    installArcgisBlock,
    installAppExtras,
    installSlatePopup,
    installCaseStudyExplorer,
  ].reduce((acc, apply) => apply(acc), config);

  return final;
};

export default applyConfig;
