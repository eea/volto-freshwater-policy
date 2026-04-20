import React, { useEffect, useState } from 'react';
import { Portal } from 'react-portal';
import { Link } from 'react-router-dom';
import Icon from '@plone/volto/components/theme/Icon/Icon';
import bookSVG from '@plone/volto/icons/book.svg';

const FavoritesToolbarButton = (props) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Portal node={document.querySelector('.toolbar-bottom')}>
      <div className="fav-toolbar-menu">
        <Link className="fav-toolbar-btn" title="Boards" to="/boards">
          <Icon name={bookSVG} size="35px" />
        </Link>
      </div>
    </Portal>
  );
};

export default FavoritesToolbarButton;
