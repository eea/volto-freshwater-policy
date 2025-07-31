import React, { useEffect, useState, useCallback, useMemo } from 'react';
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
import { connect, useSelector, useDispatch } from 'react-redux';
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
import map from 'lodash/map';

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

const itemsPerPageChoices = [10, 25, 50, 'All'];

function VisualizationRelationships(props) {
  const intl = useIntl();
  const dispatch = useDispatch();
  const visualizations = useSelector((state) => state.visualizationRelationships);
  const [filterQuery, setFilterQuery] = useState('');
  const [activePage, setActivePage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const updateResults = useCallback(() => {
    const options = {
      query: filterQuery,
      batchStart: (activePage - 1) * itemsPerPage,
      batchSize: itemsPerPage === 'All' ? 999999999999 : itemsPerPage,
    };
    dispatch(getVisualizationRelationships(getBaseUrl(props.pathname), options));
  }, [
      activePage,
      dispatch,
      filterQuery,
      itemsPerPage,
      props.pathname,
    ]);

  // Calculate page count from results
  const pages = useMemo(() => {
    let pages = Math.ceil(visualizations.items_total / itemsPerPage);
    if (pages === 0 || isNaN(pages)) {
      pages = '';
    }
    return pages;
  }, [visualizations.items_total, itemsPerPage]);

  // Update results after changing the page.
  // (We intentionally leave updateResults out of the deps.)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => updateResults(), [activePage, itemsPerPage]);

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

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                marginBottom: '20px',
              }}
            >

              {pages && (
                <Pagination
                  boundaryRange={0}
                  activePage={activePage}
                  ellipsisItem={null}
                  firstItem={null}
                  lastItem={null}
                  siblingRange={1}
                  totalPages={pages}
                  onPageChange={(e, { activePage }) =>
                    setActivePage(activePage)
                  }
                />
              )}

              <Menu.Menu
                position="right"
                style={{ display: 'flex', marginLeft: 'auto' }}
              >
                <Menu.Item style={{ color: 'grey' }}>
                  <FormattedMessage id="Show" defaultMessage="Show" />:
                </Menu.Item>
                {map(itemsPerPageChoices, (size) => (
                  <Menu.Item
                    style={{
                      padding: '0 0.4em',
                      margin: '0em 0.357em',
                      cursor: 'pointer',
                    }}
                    key={size}
                    value={size}
                    active={size === itemsPerPage}
                    onClick={(e, { value }) => {
                      setItemsPerPage(value);
                      setActivePage(1);
                    }}
                  >
                    {size}
                  </Menu.Item>
                ))}
              </Menu.Menu>

            </div>
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

