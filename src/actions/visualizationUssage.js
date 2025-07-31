import { GET_VISUALIZATION_USSAGE } from '@eeacms/volto-freshwater-policy/constants/ActionTypes';


export function getVisualizationUssage(url, options = {}) {
  const { query, batchSize, batchStart, ...rest } = options;
  const params = new URLSearchParams({
    q: query ?? '',
    b_start: batchStart ?? 0,
    b_size: batchSize ?? 99999999999,
    ...rest,
  });
  return {
    type: GET_VISUALIZATION_USSAGE,
    request: {
      op: 'get',
      path: `${url}/@@visualization-ussage?${params.toString()}`,
    },
  };
}

