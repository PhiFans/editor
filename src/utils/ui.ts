import { Nullable } from "./types";

export const setCSSProperties = (
  props: Record<string, string | number> = {}
) => {
  return props as React.CSSProperties;
};

export const setDragStyle = (style: Nullable<'horizontal' | 'vertical' | 'all'> = null) => {
  const bodyDom = document.documentElement;

  if (style === null) {
    bodyDom.classList.remove('is-dragging', 'drag-horizontal', 'drag-vertical', 'drag-all');
    return;
  }

  bodyDom.classList.add('is-dragging', `drag-${style}`);
};
