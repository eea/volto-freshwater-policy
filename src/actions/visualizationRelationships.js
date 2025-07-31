import { GET_VISUALIZATION_RELATIONSHIPS } from '@eeacms/volto-freshwater-policy/constants/ActionTypes';

export function getVisualizationRelationships(url, options = {}) {
  const { query, batchSize, batchStart, ...rest } = options;
  const params = new URLSearchParams({
    q: query ?? '',
    b_start: batchStart ?? 0,
    b_size: batchSize ?? 99999999999,
    ...rest,
  });
  return {
    type: GET_VISUALIZATION_RELATIONSHIPS,
    request: {
      op: 'get',
      path: `${url}/@@visualization-relationships?${params.toString()}`,
    },
  };
}
