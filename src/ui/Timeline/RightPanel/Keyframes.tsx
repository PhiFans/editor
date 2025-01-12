import React, { useEffect, useMemo, useState } from 'react';
import TimelineListItem from '../List/Item';
import ChartKeyframe from '@/Chart/Keyframe';
import { setCSSProperties } from '@/utils/ui';
import { ArrayEvented } from '@/utils/class';

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
  keyframes: ArrayEvented<ChartKeyframe>,
  scale: number,
};

const TimelineRightPanelKeyframes: React.FC<TimelineRightPanelKeyframesProps> = ({
  keyframes,
  scale,
}: TimelineRightPanelKeyframesProps) => {
  const [ keyframeList, setKeyframeList ] = useState<ChartKeyframe[]>([ ...keyframes ]);

  useEffect(() => {
    const updateKeyframes = (keyframe: ChartKeyframe[]) => {
      setKeyframeList([ ...keyframe ]);
    };

    keyframes.event.on('keyframes.updated', updateKeyframes);
    return (() => {
      keyframes.event.off('keyframes.updated', updateKeyframes);
    });
  }, [keyframes]);

  const keyframesMemoed = useMemo(() => {
    return keyframeList.map((keyframe, index) => {
      return <Keyframe time={keyframe.beatNum} value={keyframe.value} key={index} />
    });
  }, [keyframeList]);

  return <TimelineListItem>
    {keyframesMemoed}
  </TimelineListItem>
};

export default React.memo(TimelineRightPanelKeyframes);
