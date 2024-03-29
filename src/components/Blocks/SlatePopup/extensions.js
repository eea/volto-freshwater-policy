import { SLATEPOPUP } from './constants';

export const withSlatePupup = (editor) => {
  const { isInline } = editor;

  editor.isInline = (element) => {
    return element && element.type === SLATEPOPUP ? true : isInline(element);
  };

  return editor;
};
