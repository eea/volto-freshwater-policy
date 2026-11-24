import PageBannerActionsView from './PageBannerActionsView';
import PageBannerActionsEdit from './PageBannerActionsEdit';
import worldSVG from '@plone/volto/icons/world.svg';

const install = (config) => {
  config.blocks.blocksConfig.pageBannerActions = {
    id: 'pageBannerActions',
    title: 'Page banner actions',
    icon: worldSVG,
    group: 'freshwater_addons',
    view: PageBannerActionsView,
    edit: PageBannerActionsEdit,
    restricted: false,
    mostUsed: false,
    sidebarTab: 1,
    security: {
      addPermission: [],
      view: [],
    },
  };

  return config;
};

export default install;
