/* 
    Needed to disable the 'REMOVE_SCHEMA' action
 */

export function removeSchema() {
  return {
    type: 'REMOVE_SCHEMA(DISABLED)',
  };
}
