import View from './View';
import Edit from './Edit';
import zoomSVG from '@plone/volto/icons/zoom.svg';

import './styles.less';

const install = (config) => {
  config.blocks.blocksConfig.pageSearchBlock = {
    id: 'pageSearchBlock',
    title: 'Page search block',
    icon: zoomSVG,
    group: 'freshwater_addons',
    view: View,
    edit: Edit,
  };

  return config;
};

export default install;
