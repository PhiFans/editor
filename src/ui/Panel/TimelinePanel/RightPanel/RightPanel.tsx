import React, { useCallback, useState, useEffect, useMemo, useRef } from 'react';
import Chart from '@/Chart/Chart';
import ChartJudgeline from "@/Chart/Judgeline";
import RightPanelProvider from './Context/Provider';
import ScrollBar from '@/ui/components/ScrollBar';
import TimelineList from "../List/List";
import TimelineSeeker from './Seeker';
import RightPanelHead from './Head';
import KeyframesRow from './KeyframesRow';
import './styles.css';
import useResizeEffect from '@/ui/hooks/useResizeEffect';

export type TimelineRightPanelProps = {
  lines: ChartJudgeline[],
  expandedLines: number[],
  listScrolled: number,
  onListScroll: (scrolled: number) => void,
};

const TimelineRightPanel: React.FC<TimelineRightPanelProps> = ({
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
  const [ timeLength, setTimeLength ] = useState(0);
  const [ timeOffset, setTimeOffset ] = useState(0);

  const onSeeked = useCallback((time: number) => {
    if (!Chart.info) return;
    Chart.beatNum = time;
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

  useEffect(() => {
    const updateTimeLength = () => {
      setTimeLength(Chart.beatDuration);
    };

    Chart.events.once('music.loaded', updateTimeLength);
    Chart.events.on('bpms.updated', updateTimeLength);

    return (() => {
      Chart.events.off('music.loaded', updateTimeLength);
      Chart.events.off('bpms.updated', updateTimeLength);
    });
  }, []);

  useEffect(() => {
    const updateTimeOffset = ({ offsetBeat }: { offsetBeat: number }) => {
      setTimeOffset(offsetBeat);
    };

    Chart.events.on('offset.updated', updateTimeOffset);
    return (() => {
      Chart.events.off('offset.updated', updateTimeOffset);
    });
  });

  return (
    <RightPanelProvider timeLength={timeLength}>
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

        <div
          className='timeline-keyframes-offset-flap'
          style={{
            '--offset-length': -timeOffset,
          } as React.CSSProperties}
        />

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
