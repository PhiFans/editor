import React, { useCallback, useEffect, useRef, useState } from 'react';
import useDrag from '@/ui/hooks/useDrag';
import { parseDoublePrecist } from '@/utils/math';
import { Nullable } from '@/utils/types';
import useResizeEffect from '../hooks/useResizeEffect';

type ResizePosition = 'head' | 'bottom';

const getParentSize = (sizeRef: React.RefObject<{ width: number, height: number }>, type: 'horizontal' | 'vertical') => {
  if (type === 'horizontal') return sizeRef.current.width;
  else return sizeRef.current.height;
};

type ScrollBarProps = {
  type: 'horizontal' | 'vertical',
  size: number,
  onScroll: (position: number) => void,
  position?: number,
  minSize?: number,
  onResize?: (size: number) => void,
  flipSide?: boolean,
};

const ScrollBar = ({
  type,
  size,
  onScroll,
  minSize = 10,
  onResize,
  position = 0,
}: ScrollBarProps) => {
  const domRef = useRef<Nullable<HTMLDivElement>>(null);
  const parentDomRef = useRef<Nullable<HTMLElement>>(null);
  const parentSize = useRef({ width: 0, height: 0 });

  const currentSize = useRef(size / 100);
  const currentPosition = useRef(position / 100);

  const resizePosition = useRef<ResizePosition>('head');
  const resizeSpace = useRef(NaN);

  const startPosition = useRef(NaN);
  const startSize = useRef(NaN);

  const [ realSize, setRealSize ] = useState(currentSize.current);
  const [ realPosition, setRealPosition ] = useState(currentPosition.current);
  const [ scrolling, setScrolling ] = useState(false);

  /**
   * **Note:** Set `startPosition` before call
   */
  const updatePosition = useCallback((parentSize: number, positionDiff: number, size: number, padding = 2) => {
    const scrollSpace = parentSize - size;
    let newPositionPercent = (startPosition.current + positionDiff) / scrollSpace;

    if (newPositionPercent < 0) newPositionPercent = 0;
    if (newPositionPercent > 1) newPositionPercent = 1;

    currentPosition.current = newPositionPercent;
    setRealPosition(padding + (scrollSpace - padding * 2) * newPositionPercent);
    onScroll(parseDoublePrecist(newPositionPercent * 100, 2));
  }, [onScroll]);

  // Handle scrolling
  const { onMouseDown: handleScroll } = useDrag({
    grid: 0.1,
    thresh: 0,
    allowX: type === 'horizontal',
    allowY: type === 'vertical',

    onDragStart: useCallback(() => {
      startPosition.current = realPosition;
      startSize.current = realSize;

      setScrolling(true);
    }, [realPosition, realSize]),

    onDrag: useCallback(({ x, y }: { x: number, y: number }) => {
      const _parentSize = getParentSize(parentSize, type);
      let scrollDiff = 0;
      if (type === 'horizontal') scrollDiff = x;
      else scrollDiff = y;

      updatePosition(_parentSize, scrollDiff, startSize.current);
    }, [type, updatePosition]),

    onDragEnd: useCallback(() => {
      setScrolling(false);
    }, []),
  });

  // Handle resizing
  const { onMouseDown: handleResize } = useDrag({
    grid: 0.1,
    thresh: 0,
    allowX: type === 'horizontal',
    allowY: type === 'vertical',

    onDragStart: useCallback(() => {
      setScrolling(true);
    }, []),

    onDrag: useCallback(({ x, y }: { x: number, y: number }) => {
      const _parentSize = getParentSize(parentSize, type);
      let sizeDiff = 0;
      if (type === 'horizontal') sizeDiff = x;
      else sizeDiff = y;
      if (resizePosition.current === 'head') sizeDiff = -sizeDiff;

      const maxSize = resizeSpace.current;
      let newSize = startSize.current + sizeDiff;
      if (newSize < minSize) newSize = minSize;
      if (newSize > maxSize) newSize = maxSize;

      setRealSize(newSize);
      onResize!(parseDoublePrecist((newSize / _parentSize) * 100, 2));
      updatePosition(_parentSize, resizePosition.current === 'head' ? -sizeDiff : 0, newSize);
    }, [type, minSize, updatePosition, onResize]),

    onDragEnd: useCallback(() => {
      setScrolling(false);
    }, [])
  });

  const handleResizeStart = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, resizeType: ResizePosition) => {
    if (!onResize) return handleScroll(e);

    startPosition.current = realPosition;
    startSize.current = realSize;

    resizePosition.current = resizeType;
    if (resizeType === 'head') resizeSpace.current = realPosition + realSize;
    else resizeSpace.current = getParentSize(parentSize, type) - realPosition;

    handleResize(e);
  };

  useEffect(() => {
    if (!domRef.current) return;
    parentDomRef.current = domRef.current.parentElement;
  }, [domRef]);

  // Listen to parent resize
  useResizeEffect((size) => {
    parentSize.current = size;

    let _realSize = 0;
    let _realPosition = 0;
    if (type === 'horizontal') {
      _realSize = size.width * currentSize.current;
      _realPosition = 2 + (size.width - _realSize - 4) * currentPosition.current;
    } else {
      _realSize = size.height * currentSize.current;
      _realPosition = 2 + (size.height - _realSize - 4) * currentPosition.current;
    }

    setRealSize(_realSize);
    setRealPosition(_realPosition);
  }, parentDomRef);

  return (
    <div
      className={`scroll-bar ${type} ${scrolling ? 'scrolling' : ''}`}
      style={{
        '--size': realSize,
        '--position': realPosition
      } as React.CSSProperties}
      ref={domRef}
    >
      <div
        className={`scroll-bar-point ${onResize ? 'resizer' : 'normal'}`}
        onMouseDown={(e) => handleResizeStart(e, 'head')}
      />
      <div
        className="scroll-bar-body"
        onMouseDown={handleScroll}
      />
      <div
        className={`scroll-bar-point ${onResize ? 'resizer' : 'normal'}`}
        onMouseDown={(e) => handleResizeStart(e, 'bottom')}
      />
    </div>
  );
};

export default ScrollBar;
