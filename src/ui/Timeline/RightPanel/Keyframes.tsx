import React from 'react';
import TimelineListItem from '../List/Item';
import ChartKeyframe from '@/Chart/Keyframe';
import { setCSSProperties } from '@/utils/ui';

type KeyframeProps = {
  time: number,
  value: number,
};

const Keyframe: React.FC<KeyframeProps> = ({
  time,
  value,
}) => {
  return <div
    className="timeline-content-key"
    style={setCSSProperties({
      "--point-time": time,
      "--point-value": value,
    })}
  ></div>
};

type KeyframesProps = {
  timeRange: [number, number],
  keyframes: ChartKeyframe[],
};

const Keyframes: React.FC<KeyframesProps> = ({
  timeRange,
  keyframes,
}) => {
  const result: React.ReactNode[] = [];

  for (const keyframe of keyframes) {
    if (keyframe.beatNum < timeRange[0]) continue;
    if (keyframe.beatNum > timeRange[1]) break;

    result.push(
      <Keyframe time={keyframe.beatNum} value={keyframe.value} key={keyframe.beatNum} />
    );
  }

  return result;
};

export type TimelineRightPanelKeyframesProps = {
  keyframes: ChartKeyframe[],
  timeRange: [number, number],
  onDoubleClick: (clickedPosX: number) => void,
};

const TimelineRightPanelKeyframes: React.FC<TimelineRightPanelKeyframesProps> = ({
  keyframes,
  timeRange,
  onDoubleClick,
}: TimelineRightPanelKeyframesProps) => {
  const onRowDoubleClick = (e: MouseEvent) => {
    const target = e.target as HTMLDivElement;
    const rect = target.getBoundingClientRect();
    onDoubleClick(e.clientX - rect.x);
  };

  return <TimelineListItem onDoubleClick={(e) => onRowDoubleClick(e.nativeEvent)}>
    <Keyframes keyframes={keyframes} timeRange={timeRange} />
  </TimelineListItem>
};

export default TimelineRightPanelKeyframes;
