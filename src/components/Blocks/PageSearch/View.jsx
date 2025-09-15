import { useEffect, useMemo } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { getContent } from '@plone/volto/actions';
import RenderBlocks from '@plone/volto/components/theme/View/RenderBlocks';
import config from '@plone/volto/registry';
import { Container } from 'semantic-ui-react';
import { AccordionBlockView } from '@plone/volto/components';

const SEARCHABLE_TYPES = ['accordion'];

// Disply based on searchable type
// Search items
// Back option
function View({ props }) {
  const dispatch = useDispatch();
  const pagePath = 'sandbox/search-faq'; // TODO: Make

  useEffect(() => {
    dispatch(getContent(pagePath, null));
  }, [dispatch, pagePath]);

  const content = useSelector((state) => state?.content?.data);
  const searchableBlocks = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(content.blocks).filter(([_, value]) =>
          SEARCHABLE_TYPES.includes(value['@type']),
        ),
      ),
    [content],
  );

  console.log({ searchableBlocks });

  return (
    <Container>
      <div>Page search for previous page</div>
      {content && content.blocks && content.blocks_layout ? (
        <RenderBlocks
          {...props}
          content={content}
          blocksConfig={config.blocks.blocksConfig} // makes sure block views are resolved correctly
        />
      ) : (
        <p>Loading…</p>
      )}
    </Container>
  );
}

export default View;
