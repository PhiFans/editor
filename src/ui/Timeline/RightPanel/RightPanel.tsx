import React, { useMemo } from 'react';
import { useClockTime } from '@/ui/contexts/Clock';
import App from '@/App/App';
import ChartJudgeline from "@/Chart/Judgeline";
import TimelineList from "../List/List";
import TimelineListItem from '../List/Item';
import TimelineSeeker from '../Seeker';
import Keyframes from './Keyframes';
import { setCSSProperties } from "@/utils/ui";

type KeyframesRowProps = {
  line: ChartJudgeline,
  isExpanded: boolean;
};

const KeyframesRow: React.FC<KeyframesRowProps> = ({
  line,
  isExpanded
}) => {
  return <>
    <TimelineListItem />
    {isExpanded && <>
      <Keyframes keyframes={line.props.speed} />
      <Keyframes keyframes={line.props.positionX} />
      <Keyframes keyframes={line.props.positionY} />
      <Keyframes keyframes={line.props.rotate} />
      <Keyframes keyframes={line.props.alpha} />
    </>}
  </>
};

export type TimelineRightPanelProps = {
  timeLength: number,
  scale: number,
  lines: ChartJudgeline[],
  expandedLines: number[],
};

const TimelineRightPanel: React.FC<TimelineRightPanelProps> = ({
  timeLength,
  scale,
  lines,
  expandedLines,
}) => {
  const keyframesMemoed = useMemo(() => {
    return lines.map((line, index) => { // TODO: Render keyframes
      return <KeyframesRow line={line} isExpanded={expandedLines.includes(index)} key={index} />;
    });
  }, [lines, expandedLines]);

  return <div
    className="timeline-content-container"
    style={setCSSProperties({
      '--base-scale': scale,
    })}
  >
    <TimelineList
      className='timeline-content'
      style={setCSSProperties({
        '--time-length': timeLength,
      })}
    >
      <TimelineListItem
        className='timeline-right-panel-head'
        height={'40px'}
      ></TimelineListItem>
      {keyframesMemoed}
    </TimelineList>
    <TimelineSeeker
      currentTime={useClockTime().beat}
      timeLength={timeLength}
      scale={scale}
      onSeek={(e) => {
        if (!App.chart) return;
        App.chart.beatNum = e;
      }}
    />
  </div>
};

export default React.memo(TimelineRightPanel);
