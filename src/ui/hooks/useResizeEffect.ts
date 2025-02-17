import React, { useCallback, useEffect, useState } from 'react';
import { Nullable } from '@/utils/types';

type useResizeEffectProps = {
  domRef: React.RefObject<Nullable<HTMLElement>>,
  onResize?: (size: Size) => void,
};

type Size = {
  width: number,
  height: number,
};

const useResizeEffect = ({
  domRef,
  onResize
}: useResizeEffectProps): Size => {
  const [ size, setSize ] = useState<Size>({ width: 0, height: 0 });

  const updateSize = useCallback(() => {
    const dom = domRef.current;
    if (!dom) return;
    const { clientWidth, clientHeight } = dom;
    setSize({
      width: clientWidth,
      height: clientHeight,
    });
    if (onResize) onResize({
      width: clientWidth,
      height: clientHeight,
    });
  }, [domRef, onResize]);

  useEffect(() => {
    const dom = domRef.current;
    if (!dom) return;

    const observer = new ResizeObserver(() => {
      updateSize();
    });

    updateSize();
    observer.observe(dom);

    return (() => {
      observer.disconnect();
    });
  }, [domRef, updateSize]);

  return { ...size };
};

export default useResizeEffect;
