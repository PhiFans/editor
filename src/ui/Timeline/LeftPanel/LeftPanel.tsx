import React from "react";
import TimelineList from "../List/List";
import ChartJudgeline from "@/Chart/Judgeline";
import TimelineListItem from "../List/Item";
import { FillZero } from "@/utils/math";

export type TimelineLeftPanelProps = {
  currentTime: number,
  lines: ChartJudgeline[],
};

// XXX: Move to somewhere else?
const timeToString = (time: number) => {
  const seconds = Math.floor(time) % 60;
  const minutes = Math.floor(time / 60);
  const milliseconds = Math.floor((time - Math.floor(time)) * 1000);
  return `${FillZero(minutes)}:${FillZero(seconds)}.${FillZero(milliseconds, 4)}`;
};

const TimelineLeftPanel: React.FC<TimelineLeftPanelProps> = ({
  currentTime,
  lines,
}) => {
  const listHead = <TimelineListItem
    className='timeline-left-panel-head'
    height={'40px'}
  >
    <div className="timeline-head-current-time">
      <div className="current-time">{timeToString(currentTime)}</div>
    </div>
  </TimelineListItem>;

  return <TimelineList>
    {listHead}
    {lines.map((line, index) => {
      return <TimelineListItem key={index}>
        <div className="timeline-line-name">{`Line #${index}`}</div>
      </TimelineListItem>
    })}
  </TimelineList>
};

export default TimelineLeftPanel;
