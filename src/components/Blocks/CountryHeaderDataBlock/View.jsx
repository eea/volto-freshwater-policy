import React, { useRef } from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import { compose } from 'redux';
import { connect, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Dropdown, Loader } from 'semantic-ui-react';
import { flattenToAppURL } from '@plone/volto/helpers';
import { DataConnectedValue } from '@eeacms/volto-datablocks/Utils';
import { connectToProviderData } from '@eeacms/volto-datablocks/hocs';
import Popup from '@eeacms/volto-eea-design-system/ui/Popup/Popup';
import { sharePage } from '@eeacms/volto-eea-design-system/ui/Banner/Banner';
import Banner from '@eeacms/volto-eea-design-system/ui/Banner/Banner';
import cx from 'classnames';
import countryNames from './data/countries';
import './style.less';
import { setIsPrint } from '@eeacms/volto-eea-website-theme/actions/print';

const messages = defineMessages({
  share: {
    id: 'Share',
    defaultMessage: 'Share',
  },
  share_to: {
    id: 'Share to',
    defaultMessage: 'Share to',
  },
  download: {
    id: 'Download',
    defaultMessage: 'Download',
  },
  created: {
    id: 'Created',
    defaultMessage: 'Created',
  },
  published: {
    id: 'Published',
    defaultMessage: 'Published',
  },
  modified: {
    id: 'Modified',
    defaultMessage: 'Modified',
  },
  rssFeed: {
    id: 'rssFeed',
    defaultMessage: 'RSS Feed',
  },
});

const getClassNameUWWT = (value) => {
  switch (true) {
    case value >= 97 && value <= 100:
      return 'blue-bg';
    case value >= 95 && value <= 97:
      return 'green-bg';
    case value >= 85 && value <= 95:
      return 'yellow-bg';
    case value >= 70 && value <= 85:
      return 'orange-bg';
    case value >= 0 && value <= 70:
      return 'red-bg';
    default:
      return;
  }
};

const getClassNameWR = (value) => {
  switch (true) {
    case value >= 0 && value <= 20:
      return 'blue-bg';
    case value > 20 && value <= 40:
      return 'green-bg';
    case value > 40:
      return 'yellow-bg';
    default:
      return;
  }
};

const getContentSiblings = (siblings) => {
  const countriesDropdown = siblings?.items?.map((item) => {
    return {
      key: item.id,
      value: item.id,
      text: item.name,
      as: Link,
      to: flattenToAppURL(item.url),
    };
  });
  return countriesDropdown;
};

export const UWWTView = (props) => {
  const {
    provider_url,
    column_data,
    description,
    placeholder = '-',
    hide_data_section,
    column_value,
  } = props;

  return (
    <div className="country-data-wrapper">
      {hide_data_section ||
        (provider_url && (
          <div className="uww-country-block">
            <div className={'uww-left ' + getClassNameUWWT(column_value)}>
              <div className="uww-data">
                <div>
                  {column_value[0] === 0 ? (
                    <span>0%</span>
                  ) : (
                    <>
                      <DataConnectedValue
                        url={provider_url}
                        column={column_data}
                        placeholder={placeholder}
                      />
                      %
                    </>
                  )}
                </div>
              </div>
              {description && <span className="uww-text">{description}</span>}
            </div>
            <div className="uww-country-legend">
              <div className="legend-wrapper">
                <span className="legend-box blue-bg"></span>
                <span className="legend-text">97.1 - 100%</span>
              </div>
              <div className="legend-wrapper">
                <span className="legend-box green-bg"></span>
                <span className="legend-text">95.1 - 97%</span>
              </div>
              <div className="legend-wrapper">
                <span className="legend-box yellow-bg"></span>
                <span className="legend-text">85.1 - 95%</span>
              </div>
              <div className="legend-wrapper">
                <span className="legend-box orange-bg"></span>
                <span className="legend-text">70.1 - 85%</span>
              </div>
              <div className="legend-wrapper">
                <span className="legend-box red-bg"></span>
                <span className="legend-text">0 - 70%</span>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export const WRView = (props) => {
  const {
    provider_url,
    column_data,
    description,
    placeholder = '-',
    hide_data_section,
    column_value,
  } = props;

  return (
    <div className="country-data-wrapper">
      {hide_data_section ||
        (provider_url && (
          <div className="uww-country-block">
            <div className={'uww-left ' + getClassNameWR(column_value)}>
              <div className="uww-data">
                <div>
                  {column_value[0] === 0 ? (
                    <span>0%</span>
                  ) : (
                    <>
                      <DataConnectedValue
                        url={provider_url}
                        column={column_data}
                        placeholder={placeholder}
                      />
                      %
                    </>
                  )}
                </div>
              </div>
              {description && <span className="uww-text">{description}</span>}
            </div>
            <div className="uww-country-legend">
              <div className="legend-wrapper">
                <span className="legend-box blue-bg"></span>
                <span className="legend-text">0 - 20% No water scarcity</span>
              </div>
              <div className="legend-wrapper">
                <span className="legend-box green-bg"></span>
                <span className="legend-text">20 - 40% Water scarcity</span>
              </div>
              <div className="legend-wrapper">
                <span className="legend-box yellow-bg"></span>
                <span className="legend-text">
                  &gt; 40% Severe water scarcity
                </span>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

const View = (props) => {
  const dispatch = useDispatch();
  const { data, provider_data, content, intl } = props;
  const metadata = props.metadata || props.properties;
  const popupRef = useRef(null);

  const {
    column_data,
    hide_country_flag_section,
    hide_data_section,
    variation,
    hideDownloadButton,
    hideShareButton,
  } = data;
  const excludeItems = [
    'test',
    'sandbox',
    'data',
    'visualizations',
    'maps',
    'dashboard-tableau',
    'images',
    'discodata',
    'queries',
    'new-profiles',
    'old-profiles',
    'data-visualisation',
    'map-visualizations',
    'glossary',
  ];
  const column_value = Array.from(new Set(provider_data?.[column_data])).sort();
  const siblings = getContentSiblings(content?.['@components']?.siblings);
  const country_profiles = (siblings || []).filter(
    (item) => !excludeItems.includes(item.key),
  );

  const DataTemplate = variation === 'uwwt_profile' ? UWWTView : WRView;
  const [flag, setFlag] = React.useState();

  React.useEffect(() => {
    if (data.country_flag) {
      const code = data.country_flag.toLowerCase();
      import(`./data/svg/${code}.svg`).then((module) => {
        setFlag(module.default);
      });
    }
  });

  return (
    <div className="country-header-block">
      <div className="ui container">
        <div
          className={cx('country-header-wrapper', {
            'no-flag': !data.country_flag,
          })}
        >
          {!hide_country_flag_section ? (
            <div className="country-profile-wrapper">
              <div className="country-flag">
                {data.country_flag && (
                  <img alt={countryNames[data.country_flag]} src={flag} />
                )}
              </div>
              <Dropdown
                selection
                className="countries-dd"
                text={content.title}
                options={country_profiles}
                defaultValue={content.title.toLowerCase()}
                icon="angle down"
              />
            </div>
          ) : (
            ''
          )}
          <DataTemplate {...data} column_value={column_value} />
          {!hide_data_section && (
            <Banner.Content
              actions={
                <>
                  {!hideShareButton && (
                    <>
                      <Popup
                        className={'share-popup'}
                        trigger={
                          <Banner.Action
                            icon="ri-share-fill"
                            title={intl.formatMessage(messages.share)}
                            className="share"
                            onClick={() => {}}
                          />
                        }
                        content={
                          <>
                            <p>{intl.formatMessage(messages.share_to)}</p>
                            <div className="actions" ref={popupRef}>
                              <Banner.Action
                                icon="ri-facebook-fill"
                                title={'Share page to Facebook'}
                                titleClass={'hiddenStructure'}
                                onClick={() => {
                                  sharePage(metadata['@id'], 'facebook');
                                }}
                              />
                              <Banner.Action
                                icon="ri-twitter-x-line"
                                title={'Share page to Twitter'}
                                titleClass={'hiddenStructure'}
                                onClick={() => {
                                  sharePage(metadata['@id'], 'twitter');
                                }}
                              />
                              <Banner.Action
                                icon="ri-linkedin-fill"
                                title={'Share page to Linkedin'}
                                titleClass={'hiddenStructure'}
                                onClick={() => {
                                  sharePage(metadata['@id'], 'linkedin');
                                }}
                              />
                            </div>
                          </>
                        }
                      />
                    </>
                  )}
                  {!hideDownloadButton && (
                    <>
                      <Banner.Action
                        icon="ri-download-2-fill"
                        title="Download"
                        className="download"
                        onClick={() => {
                          // set tabs to be visible
                          const tabs =
                            document.getElementsByClassName('ui tab');
                          Array.from(tabs).forEach((tab) => {
                            tab.style.display = 'block';
                          });

                          dispatch(setIsPrint(true));
                          // display loader
                          const printLoader = document.getElementById(
                            'download-print-loader',
                          );
                          printLoader.style.display = 'flex';

                          let timeoutValue = 1000;
                          // if we have plotlycharts increase timeout
                          setTimeout(() => {
                            const plotlyCharts =
                              document.getElementsByClassName(
                                'visualization-wrapper',
                              );
                            if (plotlyCharts.length > 0) {
                              timeoutValue = timeoutValue + 1000;
                            }
                          }, timeoutValue);

                          // scroll to iframes to make them be in the viewport
                          // use timeout to wait for load
                          setTimeout(() => {
                            const iframes =
                              document.getElementsByTagName('iframe');
                            if (iframes.length > 0) {
                              timeoutValue = timeoutValue + 2000;
                              Array.from(iframes).forEach((element, index) => {
                                setTimeout(() => {
                                  element.scrollIntoView({
                                    behavior: 'instant',
                                    block: 'nearest',
                                    inline: 'center',
                                  });
                                }, timeoutValue);
                                timeoutValue = timeoutValue + 3000;
                              });
                              timeoutValue = timeoutValue + 1000;
                            }

                            setTimeout(() => {
                              window.scrollTo({
                                top: 0,
                              });
                              Array.from(tabs).forEach((tab) => {
                                tab.style.display = '';
                              });
                              printLoader.style.display = 'none';
                              dispatch(setIsPrint(false));
                              window.print();
                            }, timeoutValue);
                          }, timeoutValue);
                        }}
                      />
                      <div
                        id="download-print-loader"
                        className={cx('ui warning message')}
                        style={{
                          position: 'fixed',
                          left: '40%',
                          right: '40%',
                          backgroundColor: '#fff',
                          padding: '1em',
                          display: 'none',
                          flexDirection: 'column',
                          alignItems: 'center',
                          top: '40%',
                          zIndex: '9999',
                        }}
                      >
                        <Loader
                          disabled={false}
                          indeterminate
                          active
                          inline
                          size="medium"
                        ></Loader>
                        <div>Preparing download</div>
                      </div>
                    </>
                  )}
                </>
              }
            ></Banner.Content>
          )}
        </div>
      </div>
    </div>
  );
};

export default compose(
  injectIntl,
  connect((state, props) => ({
    content: state.content.data,
    isPrint: state.isPrint,
  })),
  connectToProviderData((props) => {
    return {
      provider_url: props.data?.provider_url,
    };
  }),
)(View);
