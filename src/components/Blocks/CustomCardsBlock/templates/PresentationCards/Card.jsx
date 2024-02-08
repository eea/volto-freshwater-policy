import React from 'react';
import { UniversalLink } from '@plone/volto/components';
import { getScaleUrl, getPath } from '@eeacms/volto-freshwater-policy/utils';
import config from '@plone/volto/registry';

const WithLink = ({ link, children, isEditMode }) =>
  link && !isEditMode ? (
    <UniversalLink className="presentation-card-wrapper" href={link}>
      {children}
    </UniversalLink>
  ) : (
    <div className="presentation-card-wrapper">{children}</div>
  );

const Card = (props) => {
  const {
    card,
    border_color,
    image_height = '220px',
    image_scale,
    isEditMode,
  } = props;

  const leadImage = card.source?.[0]?.lead_image;

  return (
    <div
      className="ui card presentation-card"
      style={
        border_color
          ? {
              borderTop: `8px solid ${border_color}`,
            }
          : {}
      }
    >
      <div className="content presentation-card-content">
        <WithLink link={card.link} isEditMode={isEditMode}>
          <>
            {leadImage && !card?.attachedimage ? (
              <div
                className="presentation-card-image"
                style={{
                  backgroundImage: `url(${card.source?.[0]['@id']
                    .replace(config.settings.apiPath, '')
                    .replace(
                      config.settings.internalApiPath,
                      '',
                    )}/@@images/image/${image_scale || 'large'})`,
                  minHeight: `${image_height}`,
                }}
              ></div>
            ) : (
              <div
                className="presentation-card-image"
                style={
                  card?.attachedimage
                    ? {
                        backgroundImage: `url(${getScaleUrl(
                          getPath(card.attachedimage),
                          image_scale || 'large',
                        )})`,
                        minHeight: `${image_height}`,
                      }
                    : {}
                }
              ></div>
            )}

            <div className="presentation-cards-content-wrapper">
              {card.title && (
                <div className="presentation-card-header">{card.title}</div>
              )}

              {!card.hide_description && card.description && (
                <div className="presentation-card-description">
                  <p>{card.description}</p>
                </div>
              )}
            </div>
          </>
        </WithLink>
      </div>

      {card.item_type && <div className="extra content">{card.item_type}</div>}
    </div>
  );
};

export default Card;
