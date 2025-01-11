import React, { useMemo } from "react";
import { useClockTime } from '@/ui/contexts/Clock';
import TimelineList from "../List/List";
import ChartJudgeline from "@/Chart/Judgeline";
import TimelineListItem from '../List/Item';
import LeftPanelLine from './Line';
import { FillZero } from "@/utils/math";
import './styles.css';

export type TimelineLeftPanelProps = {
  lines: ChartJudgeline[],
  expandedLines: number[],
  onLineExpanded: (lineIndex: number, isExpanded: boolean) => void,
};

// XXX: Move to somewhere else?
const timeToString = (time: number) => {
  const seconds = Math.floor(time) % 60;
  const minutes = Math.floor(time / 60);
  const milliseconds = Math.floor((time - Math.floor(time)) * 1000);
  return `${FillZero(minutes)}:${FillZero(seconds)}.${FillZero(milliseconds, 3)}`;
};

const TimelineLeftPanel: React.FC<TimelineLeftPanelProps> = ({
  lines,
  expandedLines,
  onLineExpanded,
}) => {
  const lineListMemoed = useMemo(() => {
    return lines.map((_line, index) => { // TODO: Render line props & add right click menu
      return <LeftPanelLine
        name={`Line #${index}`}
        isExpanded={expandedLines.includes(index)}
        onExpandClick={(e) => onLineExpanded(index, e)}
        key={index}
      />
    })
  }, [lines, expandedLines, onLineExpanded]);

  return <TimelineList>
    <TimelineListItem
      className='timeline-left-panel-head'
      height={'40px'}
    >
      <div className="timeline-head-current-time">
        <div className="current-time">{timeToString(useClockTime().time)}</div>
      </div>
    </TimelineListItem>
    {lineListMemoed}
  </TimelineList>
};

export default React.memo(TimelineLeftPanel);
