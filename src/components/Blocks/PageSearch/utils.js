import { useRef, useCallback } from 'react';

const SEARCHABLE_TYPES = ['accordion'];

export function useDebouncedCallback(callback, delay) {
  const timeoutRef = useRef();

  return useCallback(
    (...args) => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay],
  );
}

export function filterAccordionsByPanelTitle(data, searchString) {
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
