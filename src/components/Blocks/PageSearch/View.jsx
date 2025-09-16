import { useEffect, useMemo, useState } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { getContent } from '@plone/volto/actions';
import { Container, Input } from 'semantic-ui-react';

const SEARCHABLE_TYPES = ['accordion'];

function filterAccordionsByPanelTitle(data, searchString) {
  const result = {};

  for (const [accordionId, accordion] of Object.entries(data)) {
    if (!SEARCHABLE_TYPES.includes(accordion['@type'])) continue;

    const filteredBlocks = {};
    const filteredBlockOrder = [];

    for (const [panelId, panel] of Object.entries(
      accordion.data.blocks || {},
    )) {
      if (
        panel['@type'] === 'accordionPanel' &&
        panel.title &&
        panel.title.toLowerCase().includes(searchString.toLowerCase())
      ) {
        filteredBlocks[panelId] = panel;
        filteredBlockOrder.push(panelId);
      }
    }

    if (filteredBlockOrder.length > 0) {
      result[accordionId] = {
        ...accordion,
        data: {
          ...accordion.data,
          blocks: filteredBlocks,
          blocks_layout: {
            ...accordion.data.blocks_layout,
            items: filteredBlockOrder,
          },
        },
      };
    }
  }

  return result;
}

function View({ props }) {
  const [search, setSearch] = useState('');
  const dispatch = useDispatch();
  const pagePath = 'sandbox/search-faq'; // TODO: Make dynamic

  useEffect(() => {
    dispatch(getContent(pagePath, null));
  }, [dispatch, pagePath]);

  const content = useSelector((state) => state?.content?.data);
  const searchableBlocks = useMemo(() => {
    return filterAccordionsByPanelTitle(content.blocks, search);
  }, [(content, search)]);

  // console.log({ searchableBlocks, content, blocksLayout });

  return (
    <Container>
      <div className="search-wrapper">
        <div className="search-input">
          <Input
            id={`${pagePath}-searchtext`}
            placeholder={'Search in the following items'}
            fluid
            onChange={(event) => {
              setSearch(event.target.value);
            }}
          />
        </div>
      </div>
      {/* TODO: Display as accordion block */}
      {content && content.blocks && content.blocks_layout ? (
        <ul>
          {Object.entries(searchableBlocks).map(([_, item]) => (
            <>
              <li>{item.headline}</li>
              <ul>
                {Object.entries(item.data.blocks).map(([_, childItem]) => (
                  <li>{childItem.title}</li>
                ))}
              </ul>
            </>
          ))}
        </ul>
      ) : (
        <p>Loading…</p>
      )}
    </Container>
  );
}

export default View;
