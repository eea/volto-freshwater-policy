import React from 'react';
import { Card } from 'semantic-ui-react';
import { LazyLoadComponent } from 'react-lazy-load-image-component';
import { UniversalLink } from '@plone/volto/components';
import { BodyClass } from '@plone/volto/helpers';
import { getScaleUrl, getPath } from '@eeacms/volto-freshwater-policy/utils';
import { serializeNodes } from '@plone/volto-slate/editor/render';
import cx from 'classnames';

import './css/plaincards.less';

const WithLink = ({ link, children, isEditMode }) =>
  link && !isEditMode ? (
    <UniversalLink className="plain-card-link" href={link}>
      {children}
    </UniversalLink>
  ) : (
    children
  );

export const CardItem = (props) => {
  const { title, description, link, attachedimage, isEditMode } = props;

  return (
    <>
      <div className="ui card plain-card">
        <WithLink link={link} isEditMode={isEditMode}>
          {attachedimage && (
            <LazyLoadComponent>
              <div
                className="plain-card-image"
                style={
                  attachedimage
                    ? {
                        backgroundImage: `url(${getScaleUrl(
                          getPath(attachedimage),
                          'thumb',
                        )})`,
                      }
                    : {}
                }
              ></div>
            </LazyLoadComponent>
          )}

          {title && (
            <div className="content plain-card-content">
              <div className="plain-card-header">{title}</div>
            </div>
          )}

          {description && (
            <div className="content plain-card-content">
              <div className="plain-card-description">{description}</div>
            </div>
          )}
        </WithLink>
      </div>
    </>
  );
};

const PlainCards = ({ data, isEditMode }) => {
  const { title, text, cards, custom_class } = data;
  return (
    <>
      {cards && cards.length > 0 ? (
        <div className={cx('block align plain-cards-block', custom_class)}>
          <BodyClass className="has-card-tiles" />
          <div className="plain-cards-grid-wrapper">
            <div className="plain-cards-grid">
              {title && <h2 className="plain-cards-grid-title">{title}</h2>}

              {text && (
                <div className="plain-cards-grid-description">
                  {serializeNodes(text)}
                </div>
              )}

              <Card.Group className="plain-card-group">
                {(cards || []).map((card, index) => (
                  <CardItem key={index} {...card} isEditMode={isEditMode} />
                ))}
              </Card.Group>
            </div>
          </div>
        </div>
      ) : (
        <div className="block-info">Add cards from the sidebar</div>
      )}
    </>
  );
};

export default PlainCards;
