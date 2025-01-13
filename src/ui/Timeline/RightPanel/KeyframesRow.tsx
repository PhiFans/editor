import React from 'react';
import TimelineListItem from '../List/Item';
import Keyframes from './Keyframes';
import ChartJudgeline from '@/Chart/Judgeline';
import ChartJudgelineProps from '@/Chart/JudgelineProps';

type KeyframesRowProps = {
  line: ChartJudgeline,
  isExpanded: boolean,
  scale: number,
  tempo: number,
  timeRange: [number, number],
};

const KeyframesRow: React.FC<KeyframesRowProps> = ({
  line,
  isExpanded,
  scale,
  tempo,
  timeRange,
}) => {
  const onAddKeyframe = (type: keyof ChartJudgelineProps, clickedPosX: number) => {
    const beat = clickedPosX / scale;
    let beatFloor = Math.floor(beat);
    let beatSub = Math.round((beat - beatFloor) * tempo);

    if (beatSub === tempo) {
      beatFloor += 1;
      beatSub = 0;
    }

    line.addKeyframe(type, [ beatFloor, beatSub, tempo ], 1, false, 1);
  };

  return <>
    <TimelineListItem />
    {isExpanded && <>
      <Keyframes
        keyframes={line.props.speed}
        timeRange={timeRange}
        onDoubleClick={((b) => onAddKeyframe('speed', b))}
      />
      <Keyframes
        keyframes={line.props.positionX}
        timeRange={timeRange}
        onDoubleClick={((b) => onAddKeyframe('positionX', b))}
      />
      <Keyframes
        keyframes={line.props.positionY}
        timeRange={timeRange}
        onDoubleClick={((b) => onAddKeyframe('positionY', b))}
      />
      <Keyframes
        keyframes={line.props.rotate}
        timeRange={timeRange}
        onDoubleClick={((b) => onAddKeyframe('rotate', b))}
      />
      <Keyframes
        keyframes={line.props.alpha}
        timeRange={timeRange}
        onDoubleClick={((b) => onAddKeyframe('alpha', b))}
      />
    </>}
  </>
};

export default KeyframesRow;
