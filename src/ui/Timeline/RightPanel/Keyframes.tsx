import React, { useMemo } from 'react';
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

export type TimelineRightPanelKeyframesProps = {
  keyframes: ChartKeyframe[],
};

const TimelineRightPanelKeyframes: React.FC<TimelineRightPanelKeyframesProps> = ({
  keyframes,
}: TimelineRightPanelKeyframesProps) => {
  const keyframesMemoed = useMemo(() => {
    return keyframes.map((keyframe, index) => {
      return <Keyframe time={keyframe.beatNum} value={keyframe.value} key={index} />
    });
  }, [keyframes]);

  return <TimelineListItem>
    {keyframesMemoed}
  </TimelineListItem>
};

export default React.memo(TimelineRightPanelKeyframes);
