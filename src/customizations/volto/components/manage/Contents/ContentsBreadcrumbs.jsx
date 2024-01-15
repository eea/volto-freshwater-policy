import React from 'react';
import { Breadcrumb } from 'semantic-ui-react';
import { useLocation } from 'react-router-dom';
import { defineMessages, useIntl } from 'react-intl';
import { langmap } from '@plone/volto/helpers';
import { UniversalLink } from '@plone/volto/components';
import ContentsBreadcrumbsRootItem from '@plone/volto/components/manage/Contents/ContentsBreadcrumbsRootItem';
import ContentsBreadcrumbsHomeItem from '@plone/volto/components/manage/Contents/ContentsBreadcrumbsHomeItem';

import config from '@plone/volto/registry';

const messages = defineMessages({
  home: {
    id: 'Home',
    defaultMessage: 'Home',
  },
  root: {
    id: 'Root',
    defaultMessage: 'Root',
  },
});

const ContentsBreadcrumbs = (props) => {
  const { settings } = config;
  const { items } = props;
  const intl = useIntl();
  const pathname = useLocation().pathname;
  const lang = pathname.split('/')[1];

  return (
    <Breadcrumb>
      {settings.isMultilingual && (
        <>
          <UniversalLink
            href="/contents"
            className="section"
            title={intl.formatMessage(messages.root)}
          >
            <ContentsBreadcrumbsRootItem />
          </UniversalLink>
          <Breadcrumb.Divider />
        </>
      )}
      {settings.isMultilingual && pathname?.split('/')?.length > 2 && (
        <UniversalLink
          href={`/freshwater/${lang}/contents`}
          className="section"
          title={intl.formatMessage(messages.home)}
        >
          {langmap?.[lang]?.nativeName ?? lang}
        </UniversalLink>
      )}
      {!settings.isMultilingual && (
        <UniversalLink
          href="/freshwater/contents"
          className="section"
          title={intl.formatMessage(messages.home)}
        >
          <ContentsBreadcrumbsHomeItem />
        </UniversalLink>
      )}
      {items.map((breadcrumb, index, breadcrumbs) => [
        <Breadcrumb.Divider key={`divider-${breadcrumb.url}`} />,
        index < breadcrumbs.length - 1 ? (
          <UniversalLink
            key={breadcrumb.url}
            href={`${breadcrumb.url}/contents`}
            className="section"
          >
            {breadcrumb.nav_title || breadcrumb.title}
          </UniversalLink>
        ) : (
          <Breadcrumb.Section key={breadcrumb.url} active>
            {breadcrumb.nav_title || breadcrumb.title}
          </Breadcrumb.Section>
        ),
      ])}
    </Breadcrumb>
  );
};

export default ContentsBreadcrumbs;
