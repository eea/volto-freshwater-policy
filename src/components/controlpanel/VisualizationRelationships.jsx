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
import { getVisualizationRelationships } from '@eeacms/volto-freshwater-policy/actions/visualizationRelationships';
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

function VisualizationRelationships(props) {
  const intl = useIntl();
  const visualizations = useSelector((state) => state.visualizationRelationships);

  useEffect(() => {
    props.getVisualizationRelationships(getBaseUrl(props.pathname), {
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
                id="Visualizations relationship with data connectors"
                defaultmessage="Visualizations relationship with data connectors"
              />
            </Header>
          </Segment>

          <Segment>
            <Table cell>
              <Table.Row>
                <Table.HeaderCell>
                  <FormattedMessage id="Name" defaultMessage="Name" />
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <FormattedMessage id="Connector" defaultMessage="Connector" />
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <FormattedMessage id="Files" defaultMessage="Files" />
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

                {visualizations.items.map((item, index) => (
                  <Table.Row>
                    <Table.Cell>
                      <strong>{item.title}</strong>
                    </Table.Cell>
                    <Table.Cell>
                      <strong>
                        {
                          item.connector ? <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href={item.connector.path}
                          >{item.connector.title}</a>
                            : '-'
                        }
                      </strong>
                    </Table.Cell>
                    <Table.Cell>
                      <strong>
                        {
                          item.file ? <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href={item.file.path}
                          >{item.file.title}</a>
                            : '-'
                        }
                      </strong>
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
      data: state.visualizationRelationships,
      pathname: props.location.pathname,
      title: state.content.data?.title || '',
    }),
    { getVisualizationRelationships, getContent },
  ),
)(VisualizationRelationships);


