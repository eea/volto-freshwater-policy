import React, { useEffect } from 'react';
import {
  Button,
  Checkbox,
  Container,
  Form,
  Header,
  Input,
  Loader,
  Menu,
  Pagination,
  Radio,
  Segment,
  Table,
} from 'semantic-ui-react';
import { connect, useSelector } from 'react-redux';
import { compose } from 'redux';
import { Link } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { toast } from 'react-toastify';

import {
  FormattedMessage,
  defineMessages,
  injectIntl,
  useIntl,
} from 'react-intl';

import { getContent } from '@plone/volto/actions/content/content';
import { workflowMapping } from '@plone/volto/config/Workflows.js ';

import Helmet from '@plone/volto/helpers/Helmet/Helmet';
import { getBaseUrl } from '@plone/volto/helpers/Url/Url';

import Icon from '@plone/volto/components/theme/Icon/Icon';
import Toolbar from '@plone/volto/components/manage/Toolbar/Toolbar';
import Toast from '@plone/volto/componenks/manage/Toast/Toast';

import backSVG from '@plone/volto/icons/back.svg';
import { getVisualizationUssage } from '@eeacms/volto-freshwater-policy/actions/visualizationUssage';
import Circle from '@plone/volto/components/manage/Contents/circle';
import config from '@plone/volto/registry';

const messages = defineMessages({
  private: {
    id: 'private',
    defaultMessage: 'Private',
  },
  pending: {
    id: 'pending',
    defaultMessage: 'Pending',
  },
  published: {
    id: 'published',
    defaultMessage: 'Published',
  },
  intranet: {
    id: 'intranet',
    defaultMessage: 'Intranet',
  },
  draft: {
    id: 'draft',
    defaultMessage: 'Draft',
  },
  no_workflow_state: {
    id: 'no workflow state',
    defaultMessage: 'No workflow state',
  },
  none: {
    id: 'Not available',
    defaultMessage: 'None',
  },
});

function VisualizationStatus(props) {
  const intl = useIntl();
  const visualizations = useSelector((state) => state.visualizationUssage);

  useEffect(() => {
    props.getVisualizationUssage(getBaseUrl(props.pathname), {
      query: '',
      manual: '',
      datetime: '',
      batchSize: '',
    });
    props.getContent(getBaseUrl(props.pathname));
  }, []);

  return (
    <Container>
      <article id="content">
        <Segment.Group raised>
          {/*
          <Segment secondary>
            <FormattedMessage
              id="Visualizations status and ussage"
              defaultmessage="Visualizations status and ussage"
            />
          </Segment>
         */}
          <Segment className="primary">
            <Header size="small">
              <FormattedMessage
                id="Visualizations status and ussage across pages"
                defaultmessage="Visualizations status and ussage across pages"
              />
            </Header>
          </Segment>

          <Segment>
            <Table cell>
              <Table.Row>
                <Table.HeaderCell width="1">
                  <FormattedMessage id="Name" defaultMessage="Name" />
                </Table.HeaderCell>
                <Table.HeaderCell width="10">
                  <FormattedMessage id="Ussage" defaultMessage="Ussage" />
                </Table.HeaderCell>
              </Table.Row>

              <Table.Body>
                {visualizations.get.loading && (
                  <Table.Row>
                    <Table.Cell colSpan="4">
                      <Loader active inline="centered" />
                    </Table.Cell>
                  </Table.Row>
                )}

                {Object.keys(visualizations.items).map((item, index) => (
                  <Table.Row>
                    <Table.Cell>
                      <strong>{item}</strong>
                    </Table.Cell>

                    <Table.Cell>
                      {visualizations.items[item].map((obj, i) => (
                        <>
                          <div>
                            <span>
                              <Circle
                                color={
                                  config.settings.workflowMapping[
                                    obj.review_state
                                  ].color
                                }
                                size="15px"
                              />
                            </span>
                            {messages[item[index.id]]
                              ? intl.formatMessage(messages[obj.review_state])
                              : obj['review_title'] ||
                                obj['review_state'] ||
                                intl.formatMessage(messages.no_workflow_state)}
                            <span> </span>
                            <a
                              target="_blank"
                              rel="noopener noreferrer"
                              href={obj.path}
                            >
                              {obj.path}
                            </a>
                          </div>
                        </>
                      ))}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </Segment>
        </Segment.Group>
      </article>
    </Container>
  );
}

export default compose(
  injectIntl,
  connect(
    (state, props) => ({
      data: state.visualizationUssage,
      pathname: props.location.pathname,
      title: state.content.data?.title || '',
    }),
    { getVisualizationUssage, getContent },
  ),
)(VisualizationStatus);
