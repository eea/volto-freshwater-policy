/**
 * Header component.
 * @module components/theme/Header/Header
 */

import React from 'react';
import { Dropdown, Image } from 'semantic-ui-react';
import { connect, useDispatch, useSelector } from 'react-redux';

import { withRouter } from 'react-router-dom';
import { UniversalLink } from '@plone/volto/components';
import {
  getBaseUrl,
  hasApiExpander,
  flattenToAppURL,
  BodyClass,
} from '@plone/volto/helpers';
import { getNavigation } from '@plone/volto/actions';
import { Header, Logo } from '@eeacms/volto-eea-design-system/ui';
import { usePrevious } from '@eeacms/volto-eea-design-system/helpers';
import { find } from 'lodash';
import globeIcon from '@eeacms/volto-eea-design-system/../theme/themes/eea/assets/images/Header/global-line.svg';
import eeaFlag from '@eeacms/volto-eea-design-system/../theme/themes/eea/assets/images/Header/eea.png';
import config from '@plone/volto/registry';
import { getContent, getQueryStringResults } from '@plone/volto/actions';
import { compose } from 'recompose';

import cx from 'classnames';

function removeTrailingSlash(path) {
  return path.replace(/\/+$/, '');
}

// function stripPrefix(url) {
//   const { settings } = config;
//   const prefix = settings.prefixPath;
//   if (url) {
//     if (prefix && url.startsWith(prefix)) return url.slice(prefix.length);
//   }
//   return url;
// }

/**
 * EEA Specific Header component.
 */
const EEAHeader = ({ pathname, token, items, history, subsite, ...rest }) => {
  const currentLang = useSelector((state) => state.intl.locale);
  const translations = useSelector(
    (state) => state.content.data?.['@components']?.translations?.items,
  );

  const router_pathname = useSelector((state) => {
    return removeTrailingSlash(state.router?.location?.pathname) || '';
  });

  const isSubsite = subsite?.['@type'] === 'Subsite';

  const isHomePageInverse = useSelector((state) => {
    const layout = state.content?.data?.layout;
    const has_home_layout =
      layout === 'homepage_inverse_view' ||
      (__CLIENT__ && document.body.classList.contains('homepage-inverse'));
    return has_home_layout;
  });

  const { eea } = config.settings;
  const headerOpts = eea.headerOpts || {};
  const headerSearchBox = eea.headerSearchBox || [];
  const { logo, logoWhite } = headerOpts || {};
  const width = useSelector((state) => state.screen?.width);
  const dispatch = useDispatch();
  const previousToken = usePrevious(token);
  const [language, setLanguage] = React.useState(
    currentLang || eea.defaultLanguage,
  );

  React.useEffect(() => {
    const { settings } = config;
    const base_url = getBaseUrl(pathname);
    if (!hasApiExpander('navigation', base_url)) {
      dispatch(getNavigation(base_url, settings.navDepth));
    }
  }, [pathname, dispatch]);

  React.useEffect(() => {
    if (token !== previousToken) {
      const { settings } = config;
      const base = getBaseUrl(pathname);
      if (!hasApiExpander('navigation', base)) {
        dispatch(getNavigation(base, settings.navDepth));
      }
    }
  }, [token, dispatch, pathname, previousToken]);

  const linkContentTypes = useSelector(
    (state) => state.querystringsearch.subrequests?.['navigation-links']?.items,
  );

  const [initialPath] = React.useState(getBaseUrl(pathname));
  const querystring = {
    query: [
      {
        i: 'portal_type',
        o: 'plone.app.querystring.operation.selection.any',
        v: ['Link'],
      },
    ],
  };
  const adaptedQuery = Object.assign(
    { metadata_fields: '_all' },
    {
      b_size: 10,
    },
    querystring,
  );

  // querystring-search for getting all links CTs
  React.useEffect(() => {
    if (!linkContentTypes) {
      dispatch(
        getQueryStringResults(initialPath, adaptedQuery, 'navigation-links'),
      );
    }
  }, [initialPath, dispatch, linkContentTypes, adaptedQuery]);

  return (
    <Header menuItems={items}>
      {isHomePageInverse && <BodyClass className="homepage" />}
      <Header.TopHeader>
        <Header.TopItem className="official-union">
          <Image src={eeaFlag} alt="eea flag"></Image>
          <Header.TopDropdownMenu
            text="An official website of the European Union | How do you know?"
            tabletText="EEA information systems"
            mobileText=" "
            icon="chevron down"
            aria-label="dropdown"
            className=""
            viewportWidth={width}
          >
            {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
            <div
              className="content"
              onClick={(evt) => evt.stopPropagation()}
              onKeyDown={(evt) => evt.stopPropagation()}
            >
              <p>
                All official European Union website addresses are in the{' '}
                <b>europa.eu</b> domain.
              </p>
              <a
                href="https://europa.eu/european-union/contact/institutions-bodies_en"
                target="_blank"
                rel="noreferrer"
                onKeyDown={(evt) => evt.stopPropagation()}
              >
                See all EU institutions and bodies
              </a>
            </div>
          </Header.TopDropdownMenu>
        </Header.TopItem>

        {!!headerOpts.partnerLinks && (
          <Header.TopItem>
            <Header.TopDropdownMenu
              id="theme-sites"
              text={headerOpts.partnerLinks.title}
              viewportWidth={width}
            >
              <div className="wrapper">
                {headerOpts.partnerLinks.links.map((item, index) => (
                  <Dropdown.Item key={index}>
                    <a
                      href={item.href}
                      className="site"
                      target="_blank"
                      rel="noreferrer"
                      onKeyDown={(evt) => evt.stopPropagation()}
                    >
                      {item.title}
                    </a>
                  </Dropdown.Item>
                ))}
              </div>
            </Header.TopDropdownMenu>
          </Header.TopItem>
        )}

        {config.settings.isMultilingual && (
          <Header.TopDropdownMenu
            id="language-switcher"
            className="item"
            hasLanguageDropdown={
              config.settings.supportedLanguages.length > 1 &&
              config.settings.hasLanguageDropdown
            }
            text={`${language.toUpperCase()}`}
            mobileText={`${language.toUpperCase()}`}
            icon={
              <Image src={globeIcon} alt="language dropdown globe icon"></Image>
            }
            viewportWidth={width}
          >
            <ul
              className="wrapper language-list"
              role="listbox"
              aria-label="language switcher"
            >
              {eea.languages.map((item, index) => (
                <Dropdown.Item
                  as="li"
                  key={index}
                  text={
                    <span>
                      {item.name}
                      <span className="country-code">
                        {item.code.toUpperCase()}
                      </span>
                    </span>
                  }
                  onClick={() => {
                    const translation = find(translations, {
                      language: item.code,
                    });
                    const to = translation
                      ? flattenToAppURL(translation['@id'])
                      : `/${item.code}`;
                    setLanguage(item.code);
                    history.push(to);
                  }}
                ></Dropdown.Item>
              ))}
            </ul>
          </Header.TopDropdownMenu>
        )}
      </Header.TopHeader>
      <Header.Main
        pathname={pathname}
        headerSearchBox={headerSearchBox}
        inverted={isHomePageInverse ? true : false}
        transparency={isHomePageInverse ? true : false}
        logo={
          <div {...(isSubsite ? { className: 'logo-wrapper' } : {})}>
            <Logo
              src={isHomePageInverse ? logoWhite : logo}
              title={eea.websiteTitle}
              alt={eea.organisationName}
              url={eea.logoTargetUrl}
            />

            {!!subsite && subsite.title && (
              <UniversalLink item={subsite} className="subsite-logo">
                {subsite.subsite_logo ? (
                  <Image
                    src={subsite.subsite_logo.scales.mini.download}
                    alt={subsite.title}
                  />
                ) : (
                  subsite.title
                )}
              </UniversalLink>
            )}
          </div>
        }
        menuItems={items}
        renderGlobalMenuItem={(item, { onClick }) => (
          <a
            href={item.url || '/'}
            title={item.title}
            onClick={(e) => {
              e.preventDefault();
              onClick(e, item);
            }}
          >
            {item.title}
          </a>
        )}
        renderMenuItem={(item, options, props) => {
          if (linkContentTypes) {
            const linkItem = linkContentTypes?.find(
              (link) => flattenToAppURL(link['@id']) === item.url,
            );

            return (
              <UniversalLink
                href={token ? item.url || '/' : linkItem.remoteUrl}
                title={item.nav_title || item.title}
                {...(options || {})}
                className={cx(options?.className, {
                  active: item.url === router_pathname,
                })}
              >
                {props?.iconPosition !== 'right' && props?.children}
                <span>{item.nav_title || item.title}</span>
                {props?.iconPosition === 'right' && props?.children}
              </UniversalLink>
            );
          } else {
            return (
              <UniversalLink
                href={item.url || '/'}
                title={item.nav_title || item.title}
                {...(options || {})}
                className={cx(options?.className, {
                  active: item.url === router_pathname,
                })}
              >
                {props?.iconPosition !== 'right' && props?.children}
                <span>{item.nav_title || item.title}</span>
                {props?.iconPosition === 'right' && props?.children}
              </UniversalLink>
            );
          }
        }}
      ></Header.Main>
    </Header>
  );
};

export default compose(
  withRouter,
  connect(
    (state) => ({
      token: state.userSession.token,
      items: state.navigation.items,
      subsite: state.content.data?.['@components']?.subsite,
    }),
    { getNavigation },
  ),
)(EEAHeader);
