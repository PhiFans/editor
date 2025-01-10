import React, { useMemo } from 'react';
import ChartJudgeline from "@/Chart/Judgeline";
import TimelineList from "../List/List";
import TimelineListItem from '../List/Item';
import TimelineSeeker from '../Seeker';
import Keyframes from './Keyframes';
import { setCSSProperties } from "@/utils/ui";

export type TimelineRightPanelProps = {
  currentTime: number,
  timeLength: number,
  scale: number,
  lines: ChartJudgeline[],
  expandedLines: number[],
  onSeek: (newTime: number) => void,
};

const TimelineRightPanel: React.FC<TimelineRightPanelProps> = ({
  currentTime,
  timeLength,
  scale,
  lines,
  expandedLines,
  onSeek,
}) => {
  const keyframesMemoed = useMemo(() => {
    return lines.map((_line, index) => { // TODO: Render keyframes
      return <Keyframes isExpanded={expandedLines.includes(index)} key={index} />
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
      currentTime={currentTime}
      timeLength={timeLength}
      scale={scale}
      onSeek={(e) => onSeek(e)}
    />
  </div>
};

export default React.memo(TimelineRightPanel);
