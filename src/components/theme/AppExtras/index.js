import {
  FavoritesToolbarButton,
  BasketButton,
  AddToFavBoardButton,
} from './FavoritesToolbarButton';

export default (config) => {
  config.settings.appExtras = [
    ...(config.settings.appExtras || []),
    {
      match: '',
      component: FavoritesToolbarButton,
    },
    {
      match: '',
      component: BasketButton,
    },
    {
      match: '',
      component: AddToFavBoardButton,
    },
  ];

  return config;
};
