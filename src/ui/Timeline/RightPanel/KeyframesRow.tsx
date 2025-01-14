import React, { useCallback, useEffect, useState } from 'react';
import TimelineListItem from '../List/Item';
import Keyframes from './Keyframes';
import { useTempo } from '@/ui/contexts/Tempo';
import { useScale } from '../ScaleContext';
import ChartJudgeline from '@/Chart/Judgeline';
import { TChartJudgelineProps } from '@/Chart/JudgelineProps';
import ChartKeyframe from '@/Chart/Keyframe';
import { BeatArray } from '@/utils/types';

type KeyframesRowProps = {
  line: ChartJudgeline,
  isExpanded: boolean,
  timeRange: [number, number],
};

const KeyframesRow: React.FC<KeyframesRowProps> = ({
  line,
  isExpanded,
  timeRange,
}) => {
  const tempo = useTempo();
  const scale = useScale();
  const [ lineProp, setLineProp ] = useState<TChartJudgelineProps>({ ...line.props });

  const onAddKeyframe = useCallback((type: keyof TChartJudgelineProps, clickedPosX: number) => {
    const beat = clickedPosX / scale;
    let beatFloor = Math.floor(beat);
    let beatSub = Math.round((beat - beatFloor) * tempo);

    if (beatSub === tempo) {
      beatFloor += 1;
      beatSub = 0;
    }

    line.addKeyframe(type, [ beatFloor, beatSub, tempo ], 1, false, 1);
  }, [scale, tempo, line]);

  const onKeyframeMove = useCallback((type: keyof TChartJudgelineProps, index: number, newBeat: BeatArray) => {
    line.editKeyframe(type, index, newBeat);
  }, [line]);

  const handlePropsUpdate = useCallback(({
    type,
    keyframes,
  }: {
    type: keyof TChartJudgelineProps,
    keyframes: ChartKeyframe[],
  }) => {
    const newProp: Partial<TChartJudgelineProps> = {};
    newProp[type] = keyframes;
    setLineProp({ ...lineProp, ...newProp });
  }, [lineProp]);

  useEffect(() => {
    line.events.on('props.updated', handlePropsUpdate);
    return (() => {
      line.events.off('props.updated', handlePropsUpdate);
    });
  }, [line, handlePropsUpdate]);

  return <>
    <TimelineListItem />
    {isExpanded && <>
      <Keyframes
        type='speed'
        keyframes={lineProp.speed}
        timeRange={timeRange}
        onDoubleClick={onAddKeyframe}
        onKeyframeMove={onKeyframeMove}
      />
      <Keyframes
        type='positionX'
        keyframes={lineProp.positionX}
        timeRange={timeRange}
        onDoubleClick={onAddKeyframe}
        onKeyframeMove={onKeyframeMove}

      />
      <Keyframes
        type='positionY'
        keyframes={lineProp.positionY}
        timeRange={timeRange}
        onDoubleClick={onAddKeyframe}
        onKeyframeMove={onKeyframeMove}
      />
      <Keyframes
        type='rotate'
        keyframes={lineProp.rotate}
        timeRange={timeRange}
        onDoubleClick={onAddKeyframe}
        onKeyframeMove={onKeyframeMove}
      />
      <Keyframes
        type='alpha'
        keyframes={lineProp.alpha}
        timeRange={timeRange}
        onDoubleClick={onAddKeyframe}
        onKeyframeMove={onKeyframeMove}
      />
    </>}
  </>
};

export default KeyframesRow;
