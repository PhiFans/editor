import React, { useRef, useEffect, useCallback } from 'react';
import { useScale } from '../ScaleContext';
import { parseDoublePrecist } from '@/utils/math';

export type RangeContainerProps = {
  timeLength: number,
  children: React.ReactNode,
  onRangeChanged: (newRange: [number, number]) => void,
};

const RangeContainer: React.FC<RangeContainerProps> = ({
  timeLength,
  children,
  onRangeChanged,
}) => {
  const scale = useScale();
  const containerRef = useRef<HTMLDivElement>(null);
  const containerWidth = useRef(0);
  const containerScrolled = useRef(0);

  const updateTimeRange = useCallback(() => {
    const start = parseDoublePrecist(containerScrolled.current / scale, 6, -1);
    const end = parseDoublePrecist((containerWidth.current / scale) + start, 6, 1);
    onRangeChanged([ start, end ]);
  }, [scale, onRangeChanged]);

  const onContainerScrolled = useCallback((e: UIEvent) => {
    const target = e.target as HTMLDivElement;
    containerScrolled.current = target.scrollLeft;
    updateTimeRange();
  }, [updateTimeRange]);

  useEffect(() => {
    const updateContainerWidth = () => {
      const containerDom = containerRef.current;
      if (!containerDom) return;

      containerWidth.current = containerDom.clientWidth;
      updateTimeRange();
    };

    updateContainerWidth();
    window.addEventListener('resize', updateContainerWidth);
    return (() => {
      window.removeEventListener('resize', updateContainerWidth);
    });
  }, [updateTimeRange]);

  return (
    <div
      className="timeline-content-container"
      style={{
        '--base-scale': scale,
        '--time-length': timeLength,
      } as React.CSSProperties}
      onScroll={(e) => onContainerScrolled(e.nativeEvent)}
      onContextMenu={(e) => e.preventDefault()}
      ref={containerRef}
    >
      {children}
    </div>
  );
};

export default RangeContainer;
