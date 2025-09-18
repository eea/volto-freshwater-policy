import { useCallback, useEffect, useMemo, useState } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { getContent } from '@plone/volto/actions';
import { Input, Button } from 'semantic-ui-react';
import { RenderBlocks } from '@plone/volto/components';
import { useLocation, useHistory } from 'react-router-dom';
import { Container } from 'semantic-ui-react';

import { filterAccordionsByPanelTitle, useDebouncedCallback } from './utils';

function View(props) {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const metadata = props.metadata || props.properties;
  const pagePath = 'freshwater/sandbox/search-faq'; // TODO: Make dynamic

  const query = new URLSearchParams(location.search);
  const searchQuery = query.get('searchQuery') || '';

  const [searchInput, setSearchInput] = useState(searchQuery);

  const handleChange = (event) => {
    setSearchInput(event.target.value);
    updateQuery(event);
  };

  const updateQuery = useDebouncedCallback((event) => {
    const { name, value } = event?.target;

    const params = new URLSearchParams({ [name]: value });
    history.replace({ pathname: location.pathname, search: params.toString() });
  }, 300);

  useEffect(() => {
    dispatch(getContent(pagePath, null));
  }, [dispatch, pagePath]);

  const content = useSelector((state) => state?.content?.data);

  const searchableBlocks = useMemo(() => {
    return filterAccordionsByPanelTitle(content.blocks, searchQuery);
  }, [(content, searchQuery)]);

  const renderSearchedBlocks = useCallback(() => {
    const blocks = Object.entries(searchableBlocks);

    if (blocks.length === 0) {
      return (
        <div className="pageSearchBlock">
          <p>No items found</p>
        </div>
      );
    }
    return blocks.map(([key, value]) => (
      <div key={key} className="pageSearchBlock">
        <RenderBlocks
          location={location}
          metadata={metadata}
          content={{
            blocks: { [key]: value },
            blocks_layout: { items: [key] },
          }}
        />
      </div>
    ));
  }, [searchQuery]);

  return (
    <div>
      <Container>
        <div id="pageSearchInput">
          <Input id={`${pagePath}-searchtext`} fluid action>
            <input
              onChange={handleChange}
              name="searchQuery"
              value={searchInput}
              placeholder={'Search in the following items'}
            />
            <Button
              type="button"
              onClick={() => {
                alert('Go back');
              }}
            >
              Back
            </Button>
          </Input>
        </div>
        {renderSearchedBlocks()}
      </Container>
    </div>
  );
}

export default View;
