import { useEffect } from 'react';
import { connect } from 'react-redux';
import { removeSchema } from '@eeacms/volto-eea-website-theme/actions';
import { flattenToAppURL } from '@plone/volto/helpers';

function addFreshwaterToPath(path) {
  if (!path.startsWith('/freshwater')) {
    return '/freshwater' + path;
  }

  return path;
}

function RemoveSchema({ removeSchema, contentLoading, content, schema }) {
  useEffect(() => {
    if (
      !schema.loading &&
      !contentLoading &&
      schema.schema &&
      (!content ||
        (content &&
          schema.contentUrl !==
            addFreshwaterToPath(flattenToAppURL(content['@id']))))
    ) {
      removeSchema();
    }
  }, [removeSchema, content, contentLoading, schema]);

  return null;
}

export default connect(
  (state) => ({
    content: state.content.data,
    contentLoading: state.content.get.loading,
    schema: state.schema,
  }),
  { removeSchema },
)(RemoveSchema);
