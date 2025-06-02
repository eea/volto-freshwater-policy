import View from './View';
import Edit from './Edit';
import { PickObjectWidget } from '@eeacms/volto-datablocks/components';
import tableSVG from '@plone/volto/icons/table.svg';

const install = (config) => {
  config.blocks.blocksConfig.nwrmBenefitsTableBlock = {
    id: 'nwrmBenefitsTableBlock',
    title: 'NWRM Benefits table block',
    icon: tableSVG,
    group: 'freshwater_addons',
    view: View,
    edit: Edit,
    restricted: false,
    mostUsed: false,
    sidebarTab: 1,
    security: {
      addPermission: [],
      view: [],
    },
  };

  config.widgets.widget.pick_object = PickObjectWidget;
  return config;
};

export default install;
