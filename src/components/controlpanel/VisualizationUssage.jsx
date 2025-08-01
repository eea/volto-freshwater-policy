import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  Container,
  Header,
  Loader,
  Menu,
  Pagination,
  Segment,
  Table,
} from 'semantic-ui-react';
import { connect, useSelector, useDispatch } from 'react-redux';
import { compose } from 'redux';

import {
  FormattedMessage,
  defineMessages,
  injectIntl,
  useIntl,
} from 'react-intl';

import { getContent } from '@plone/volto/actions/content/content';

import Helmet from '@plone/volto/helpers/Helmet/Helmet';
import { getBaseUrl } from '@plone/volto/helpers/Url/Url';

import { getVisualizationUssage } from '@eeacms/volto-freshwater-policy/actions/visualizationUssage';
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
  visualizationUssage: {
    id: 'Visualization Ussage',
    defaultMessage: 'Visualization Ussage',
  },
});

const itemsPerPageChoices = [10, 25, 50, 'All'];

function VisualizationStatus(props) {
  const title = props;
  const intl = useIntl();
  const visualizations = useSelector((state) => state.visualizationUssage);
  const dispatch = useDispatch();

  const [filterQuery, setFilterQuery] = useState('');
  const [activePage, setActivePage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const updateResults = useCallback(() => {
    const options = {
      query: filterQuery,
      batchStart: (activePage - 1) * itemsPerPage,
      batchSize: itemsPerPage === 'All' ? 999999999999 : itemsPerPage,
    };
    dispatch(getVisualizationUssage(getBaseUrl(props.pathname), options));
  }, [activePage, dispatch, filterQuery, itemsPerPage, props.pathname]);

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
    props.getVisualizationUssage(getBaseUrl(props.pathname), {
      query: '',
      manual: '',
      datetime: '',
      batchSize: '',
    });
    props.getContent(getBaseUrl(props.pathname));
    // eslint-disable-next-line
  }, []);

  return (
    <div id="page-visualization-ussage">
      <Helmet title={intl.formatMessage(messages.visualizationUssage)} />
      <Container>
        <article id="content">
          <Segment.Group raised>
            <Segment className="primary">
              <Header size="small">
                <FormattedMessage
                  id="Visualization Ussage"
                  defaultmessage="Visualization Ussage"
                  title={{ title: <q>{title}</q> }}
                />
              </Header>
            </Segment>

            <Segment>
              <Table cell>
                <Table.Row>
                  <Table.HeaderCell>
                    <FormattedMessage
                      id="Visualization"
                      defaultMessage="Visualization"
                    />
                  </Table.HeaderCell>
                  <Table.HeaderCell>
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
                                  intl.formatMessage(
                                    messages.no_workflow_state,
                                  )}
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
    </div>
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
