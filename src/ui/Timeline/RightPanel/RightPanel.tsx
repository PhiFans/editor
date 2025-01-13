import React, { useCallback, useMemo, useState } from 'react';
import App from '@/App/App';
import ChartJudgeline from "@/Chart/Judgeline";
import TimelineList from "../List/List";
import TimelineSeeker from '../Seeker';
import RangeContainer from './RangeContainer';
import RightPanelHead from './Head';
import KeyframesRow from './KeyframesRow';
import { useScale } from '../ScaleContext';
import './styles.css';

export type TimelineRightPanelProps = {
  timeLength: number,
  lines: ChartJudgeline[],
  expandedLines: number[],
};

const TimelineRightPanel: React.FC<TimelineRightPanelProps> = ({
  timeLength,
  lines,
  expandedLines,
}) => {
  const scale = useScale();
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
        timeRange={timeRange}
        key={index}
      />;
    });
  }, [lines, expandedLines, timeRange]);

  return (
    <RangeContainer
      timeLength={timeLength}
      onRangeChanged={handleRangeChanged}
    >
      <RightPanelHead
        timeRange={timeRange}
        onClick={onHeadClicked}
      />
      <TimelineList className='timeline-content'>
        {keyframeRowMemoed}
      </TimelineList>
      <TimelineSeeker
        timeLength={timeLength}
        onSeek={onSeeked}
      />
    </RangeContainer>
  )
};

export default TimelineRightPanel;
