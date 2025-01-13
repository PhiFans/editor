import React, { useCallback, useMemo, useState } from 'react';
import App from '@/App/App';
import ChartJudgeline from "@/Chart/Judgeline";
import TimelineList from "../List/List";
import TimelineSeeker from '../Seeker';
import RangeContainer from './RangeContainer';
import RightPanelHead from './Head';
import KeyframesRow from './KeyframesRow';
import './styles.css';

export type TimelineRightPanelProps = {
  timeLength: number,
  scale: number,
  lines: ChartJudgeline[],
  expandedLines: number[],
  tempo: number,
};

const TimelineRightPanel: React.FC<TimelineRightPanelProps> = ({
  timeLength,
  scale,
  lines,
  expandedLines,
  tempo,
}) => {
  const [ timeRange, setTimeRange ] = useState<[number, number]>([ 0, 0 ]);

  const handleRangeChanged = useCallback((newRange: [number, number]) => {
    setTimeRange(newRange);
  }, []);

  const onSeeked = useCallback((time: number) => {
    if (!App.chart) return;
    App.chart.beatNum = time;
  }, []);

  const onHeadClicked = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const target = e.target as HTMLDivElement;
    const rect = target.getBoundingClientRect();
    const clickAtTime = (e.clientX - rect.x) / scale;

    onSeeked(clickAtTime);
  }, [onSeeked, scale]);

  const keyframeRowMemoed = useMemo(() => {
    return lines.map((line, index) => { // TODO: Render keyframes
      return <KeyframesRow
        line={line}
        isExpanded={expandedLines.includes(index)}
        scale={scale}
        tempo={tempo}
        timeRange={timeRange}
        key={index}
      />;
    });
  }, [lines, expandedLines, scale, tempo, timeRange]);

  return (
    <RangeContainer
      scale={scale}
      onRangeChanged={handleRangeChanged}
    >
      <RightPanelHead
        timeRange={timeRange}
        tempo={tempo}
        onClick={onHeadClicked}
      />
      <TimelineList
        className='timeline-content'
        style={{
          '--time-length': timeLength,
        } as React.CSSProperties}
      >
        {keyframeRowMemoed}
      </TimelineList>
      <TimelineSeeker
        timeLength={timeLength}
        scale={scale}
        onSeek={onSeeked}
      />
    </RangeContainer>
  )
};

export default TimelineRightPanel;
