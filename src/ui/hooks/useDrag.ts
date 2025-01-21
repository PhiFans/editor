import { Nullable } from '@/utils/types';
import { setDragStyle } from '@/utils/ui';
import { useRef, useCallback, useEffect } from 'react';

const DRAG_THRESH = 5;

type Point = {
  x: number,
  y: number,
};

type MouseDownEvent = {
  clientX: number,
  clientY: number,
};

type UseDragProps = {
  grid?: number,
  allowX?: boolean,
  allowY?: boolean,
  onDrag?: (point: Point) => void,
  onDragEnd?: (point: Point) => void,
  onClick?: () => void,
};

// Thanks to [lil.gui](https://github.com/georgealways/lil-gui/blob/master/src/NumberController.js#L140)
// for the drag algorithm

const useDrag = ({
  grid = void 0,
  allowX = true,
  allowY = true,
  onDrag, onDragEnd, onClick,
}: UseDragProps) => {
  const isDragging = useRef(false);
  const isDragTesting = useRef(false);
  const dragStartPos = useRef<Point>({ x: NaN, y: NaN });
  const dragDelta = useRef<Nullable<Point>>(null);
  const lastDragPos = useRef<Nullable<Point>>(null);

  const gridDrag = useCallback((value: number) => {
    if (grid === void 0) return value;
    else return Math.round(value / grid) * grid;
  }, [grid]);

  const handleMouseDown = useCallback((e: MouseDownEvent) => {
    isDragging.current = true;
    isDragTesting.current = true;

    dragStartPos.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handleMouseUp = useCallback(() => {
    if (!isDragging.current) return;
    if (dragDelta.current === null && onClick) onClick();
    else if (dragDelta.current !== null && onDragEnd) onDragEnd(dragDelta.current);

    isDragging.current = false;
    isDragTesting.current = false;

    dragStartPos.current = { x: NaN, y: NaN };
    dragDelta.current = null;

    setDragStyle(null);
  }, [onClick, onDragEnd]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging.current) return;

    if (isDragTesting.current) {
      const dx = e.clientX - dragStartPos.current.x;
      const dy = e.clientY - dragStartPos.current.y;

      if (
        (allowX && Math.abs(dx) > DRAG_THRESH) ||
        (allowY && Math.abs(dy) > DRAG_THRESH)
      ) {
        e.preventDefault();
        isDragTesting.current = false;

        if (!allowX && allowY) setDragStyle('vertical');
        else if (allowX && !allowY) setDragStyle('horizontal');
        else setDragStyle('all');
      }
    }

    if (!isDragTesting.current) {
      if (dragDelta.current === null) dragDelta.current = { x: 0, y: 0 };

      let dx = 0;
      let dy = 0;

      if (allowX) dx = gridDrag(e.clientX - dragStartPos.current.x);
      if (allowY) dy = gridDrag(e.clientY - dragStartPos.current.y);

      dragDelta.current = { x: dx, y: dy };
      if (
        lastDragPos.current === null ||
        (
          lastDragPos.current.x !== dragDelta.current.x ||
          lastDragPos.current.y !== dragDelta.current.y
        )
      ) {
        if (onDrag) onDrag(dragDelta.current);
        lastDragPos.current = { ...dragDelta.current };
      }
    }
  }, [allowX, allowY, gridDrag, onDrag]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return {
    onMouseDown: handleMouseDown,
  };
};

export default useDrag;
