import React, { useCallback, useMemo, useRef } from 'react';
import App from '@/App/App';
import ChartJudgeline from "@/Chart/Judgeline";
import RightPanelProvider from './Context/Provider';
import ScrollBar from '@/ui/components/ScrollBar';
import TimelineList from "../List/List";
import TimelineSeeker from '../Seeker';
import RightPanelHead from './Head';
import KeyframesRow from './KeyframesRow';
import './styles.css';
import useResizeEffect from '@/ui/hooks/useResizeEffect';

export type TimelineRightPanelProps = {
  timeLength: number,
  lines: ChartJudgeline[],
  expandedLines: number[],
  listScrolled: number,
  onListScroll: (scrolled: number) => void,
};

const TimelineRightPanel: React.FC<TimelineRightPanelProps> = ({
  timeLength,
  lines,
  expandedLines,
  listScrolled,
  onListScroll,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollContentRef = useRef<HTMLDivElement>(null);
  const containerHeight = useRef(0);
  const contentHeight = useRef(0);
  const listScrollRef = useRef(0);

  const onSeeked = useCallback((time: number) => {
    if (!App.chart) return;
    App.chart.beatNum = time;
  }, []);

  const keyframeRowMemoed = useMemo(() => {
    return lines.map((line, index) => { // TODO: Render keyframes
      return <KeyframesRow
        line={line}
        isExpanded={expandedLines.includes(index)}
        key={line.id}
      />;
    });
  }, [lines, expandedLines]);

  const updateListScroll = useCallback((_scroll: number) => {
    const scroll = _scroll / 100;
    const heightDiff = contentHeight.current - containerHeight.current;

    onListScroll(heightDiff * scroll);
    listScrollRef.current = _scroll;
  }, [onListScroll]);

  useResizeEffect(({ height }) => {
    containerHeight.current = height;
    updateListScroll(listScrollRef.current);
  }, scrollContainerRef);

  useResizeEffect(({ height }) => {
    contentHeight.current = height;
    updateListScroll(listScrollRef.current);
  }, scrollContentRef);

  return (
    <RightPanelProvider>
      <RightPanelHead
        onSeek={onSeeked}
      />
      <div
        className='scroller-container'
        style={{
          height: 'calc(100% - 40px)'
        }}
        ref={scrollContainerRef}
      >
        <TimelineList
          className='timeline-content'
          style={{
            position: 'relative',
            top: -listScrolled
          }}
          ref={scrollContentRef}
        >
          {keyframeRowMemoed}
        </TimelineList>
        <ScrollBar
          type="vertical"
          size={20}
          onScroll={updateListScroll}
        />
      </div>
      <TimelineSeeker
        timeLength={timeLength}
        onSeek={onSeeked}
      />
    </RightPanelProvider>
  )
};

export default TimelineRightPanel;
