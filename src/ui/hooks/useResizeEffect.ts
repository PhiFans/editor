import React, { useCallback, useEffect, useRef } from 'react';
import { Nullable } from '@/utils/types';

type Size = {
  width: number,
  height: number,
};

const useResizeEffect = (
  callback: (size: Size) => void,
  domRef: React.RefObject<Nullable<HTMLElement>>
): void => {
  const lastSizeRef = useRef<Size>({ width: 0, height: 0 });

  const updateSize = useCallback(() => {
    const dom = domRef.current;
    if (!dom) return;

    const { clientWidth, clientHeight } = dom;
    if (
      lastSizeRef.current.width !== clientWidth ||
      lastSizeRef.current.height !== clientHeight
    ) {
      callback({
        width: clientWidth,
        height: clientHeight,
      });
      lastSizeRef.current.width = clientWidth;
      lastSizeRef.current.height = clientHeight;
    }
  }, [callback, domRef]);

  useEffect(() => {
    const dom = domRef.current;
    if (!dom) return;

    const resizer = new ResizeObserver(() => {
      updateSize();
    });

    updateSize();
    resizer.observe(dom);

    return (() => {
      resizer.disconnect();
    });
  }, [domRef, updateSize]);
};

export default useResizeEffect;
