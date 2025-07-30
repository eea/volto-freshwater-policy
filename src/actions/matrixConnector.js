import {
  GET_ALL_VISUALIZATIONS
} from '@eeacms/volto-freshwater-policy/constants/ActionTypes';

export function getVisualizations(url, options = {}) {
  const { query, batchSize, batchStart, ...rest } = options;
  const params = new URLSearchParams({
    q: query ?? '',
    b_start: batchStart ?? 0,
    b_size: batchSize ?? 99999999999,
    ...rest,
  });
  return {
    type: GET_ALL_VISUALIZATIONS,
    request: {
      op: 'get',
      path: `${url}/@@visualizations-status?${params.toString()}`,
    },
  };
}
