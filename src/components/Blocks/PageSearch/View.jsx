import { useEffect, useMemo, useState } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { getContent } from '@plone/volto/actions';
import { Input } from 'semantic-ui-react';
import { RenderBlocks } from '@plone/volto/components';
import cx from 'classnames';
import { useLocation } from 'react-router-dom';
import { getColumns } from './utils';

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

function View(props) {
  console.log({ props });
  const [pageDocumentHeight, setPageDocumentHeight] = useState(0);
  const [pageSearchInput, setPageSearchInput] = useState(0);
  const [search, setSearch] = useState('');
  const dispatch = useDispatch();
  const pagePath = 'sandbox/search-faq'; // TODO: Make dynamic

  const location = useLocation();
  const metadata = props.metadata || props.properties;
  const { data = {} } = props;
  const columnList = getColumns(data);

  useEffect(() => {
    dispatch(getContent(pagePath, null));
  }, [dispatch, pagePath]);

  useEffect(() => {
    const pageDocument = document.getElementById('page-document');
    const pageSearchInput = document.getElementById('pageSearchInput');
    // if (!pageDocument) {
    //   return;
    // }
    // if (pageDocument) {
    //   const { height } = pageDocument.getBoundingClientRect();
    //   console.log('h1', { height });
    //   setPageDocumentHeight(height);
    // }
    if (pageSearchInput) {
      const { height } = pageSearchInput.getBoundingClientRect();
      setPageSearchInput(height);
    }
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { height } = entry.contentRect;
        console.log('h2', {
          height,
        });
        setPageDocumentHeight(height);
      }
    });
    observer.observe(pageDocument);
    return () => observer.disconnect(); // cleanup
  }, []);

  const content = useSelector((state) => state?.content?.data);
  const searchableBlocks = useMemo(() => {
    return filterAccordionsByPanelTitle(content.blocks, search);
  }, [(content, search)]);
  const blocksLayout = useMemo(() => {
    return {
      items: Object.keys(searchableBlocks),
    };
  }, [searchableBlocks]);

  console.log({ searchableBlocks, content, blocksLayout });

  return (
    <div className="pageSearch">
      <div id="pageSearchInput">
        <Input
          id={`${pagePath}-searchtext`}
          placeholder={'Search in the following items'}
          fluid
          onChange={(event) => {
            setSearch(event.target.value);
          }}
        />
      </div>
      {search && (
        <div
          className="pageSearchContent"
          style={{
            height: pageDocumentHeight - pageSearchInput,
            top: 0 + pageSearchInput,
          }}
        >
          <RenderBlocks
            {...props}
            location={location}
            metadata={metadata}
            content={{
              ...content,
              blocks: searchableBlocks,
              blocks_layout: blocksLayout,
            }}
          />
        </div>
      )}
    </div>
  );
}

export default View;
