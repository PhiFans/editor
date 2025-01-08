import React from 'react';
import ChartJudgeline from "@/Chart/Judgeline";
import TimelineList from "../List/List";
import TimelineListItem from '../List/Item';
import TimelineSeeker from '../Seeker';
import { setCSSProperties } from "@/utils/ui";

export type TimelineRightPanelProps = {
  currentTime: number,
  timeLength: number,
  scale: number,
  lines: ChartJudgeline[],
  onSeek: (newTime: number) => void,
};

const TimelineRightPanel: React.FC<TimelineRightPanelProps> = ({
  currentTime,
  timeLength,
  scale,
  lines,
  onSeek,
}) => {
  const listHead = <TimelineListItem
    className='timeline-right-panel-head'
    height={'40px'}
  ></TimelineListItem>;

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
      {listHead}
      {lines.map((line, index) => { // TODO: Render keyframes
        return <TimelineListItem key={index}>
          <div className="timeline-line-name"></div>
        </TimelineListItem>
      })}
    </TimelineList>
    <TimelineSeeker
      currentTime={currentTime}
      timeLength={timeLength}
      scale={scale}
      onSeek={(e) => onSeek(e)}
    />
  </div>
};

export default TimelineRightPanel;
