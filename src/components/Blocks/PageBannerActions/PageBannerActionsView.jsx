import React, { useRef } from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import { compose } from 'redux';
import { connect, useDispatch } from 'react-redux';
import Popup from '@eeacms/volto-eea-design-system/ui/Popup/Popup';
import Banner, {
  sharePage,
} from '@eeacms/volto-eea-design-system/ui/Banner/Banner';
import { setupPrintView } from '@eeacms/volto-eea-website-theme/helpers/setupPrintView';

import './style.less';

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
});

export const PageBannerActionsView = (props) => {
  const dispatch = useDispatch();
  const { data = {}, content, intl } = props;
  const metadata = props.metadata || props.properties || content;
  const popupRef = useRef(null);

  return (
    <div className="page-banner-actions-block">
      <Banner.Content
        actions={
          <>
            {!data.hideShareButton && (
              <Popup
                className="share-popup"
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
                        title="Share page to Facebook"
                        titleClass="hiddenStructure"
                        onClick={() => sharePage(metadata['@id'], 'facebook')}
                      />
                      <Banner.Action
                        icon="ri-twitter-x-line"
                        title="Share page to Twitter"
                        titleClass="hiddenStructure"
                        onClick={() => sharePage(metadata['@id'], 'twitter')}
                      />
                      <Banner.Action
                        icon="ri-linkedin-fill"
                        title="Share page to Linkedin"
                        titleClass="hiddenStructure"
                        onClick={() => sharePage(metadata['@id'], 'linkedin')}
                      />
                    </div>
                  </>
                }
              />
            )}
            {!data.hideDownloadButton && (
              <Banner.Action
                icon="ri-download-2-fill"
                title={intl.formatMessage(messages.download)}
                className="download"
                onClick={() => setupPrintView(dispatch)}
              />
            )}
          </>
        }
      />
    </div>
  );
};

export default compose(
  injectIntl,
  connect((state) => ({
    content: state.content.data,
  })),
)(PageBannerActionsView);
