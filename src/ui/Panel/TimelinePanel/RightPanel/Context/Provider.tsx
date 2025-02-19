import { useRef, useState, useCallback, useEffect } from 'react';
import useResizeEffect from '@/ui/hooks/useResizeEffect';
import ScrollBar from '@/ui/components/ScrollBar';
import RightPanelContext from '.';

type RightPanelProviderProps = {
  timeLength: number,
  children: React.ReactNode,
};

const RightPanelProvider = ({
  timeLength,
  children
}: RightPanelProviderProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const containerWidth = useRef<number>(0);
  const scrollerPosition = useRef<number>(0);
  const scrollerScale = useRef<number>(0.05);
  const lastScrolled = useRef<number>(0);
  const lastScale = useRef<number>(0);
  const [ scale, setScale ] = useState(10);
  const [ timeScrolled, setTimeScrolled ] = useState(0);
  const [ timeRange, setTimeRange ] = useState<[number, number]>([ 0, 10 ]);

  const updateTimeRange = useCallback(() => {
    const timeScale = (
      (containerWidth.current / scrollerScale.current) /
      (timeLength > 0 ? timeLength : 200)
    );
    const timeVisible = (containerWidth.current / timeScale);
    const _timeScrolled = (timeLength > 0 ?
      timeLength - timeVisible : 0
    ) * scrollerPosition.current;

    if (
      lastScrolled.current !== _timeScrolled ||
      lastScale.current !== timeScale
    ) {
      setScale(timeScale);
      setTimeScrolled(_timeScrolled);

      setTimeRange([
        _timeScrolled,
        _timeScrolled + timeVisible
      ]);

      lastScrolled.current = _timeScrolled;
      lastScale.current = timeScale;
    }
  }, [timeLength]);

  const updateScroll = useCallback((position: number) => {
    scrollerPosition.current = position / 100;
    updateTimeRange();
  }, [updateTimeRange]);

  const updateScrollResize = useCallback((scale: number) => {
    scrollerScale.current = scale / 100;
  }, []);

  useResizeEffect(({ width }) => {
    containerWidth.current = width;
    updateTimeRange();
  }, containerRef);

  useEffect(() => {
    updateTimeRange();
  }, [timeLength, updateTimeRange]);

  return (
    <RightPanelContext.Provider
      value={{
        scale: scale,
        timeRange: timeRange
      }}
    >
      <div
        className="timeline-content-container"
        style={{
          '--base-scale': scale,
          '--time-scrolled': timeScrolled,
        } as React.CSSProperties}
        onContextMenu={(e) => e.preventDefault()}
        ref={containerRef}
      >
        {children}
        <ScrollBar
          type="horizontal"
          size={5}
          minSize={30}
          onScroll={updateScroll}
          onResize={updateScrollResize}
        />
      </div>
    </RightPanelContext.Provider>
  );
};

export default RightPanelProvider;
