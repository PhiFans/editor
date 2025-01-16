import React, { useCallback, useEffect, useState } from 'react';
import TimelineListItem from '../List/Item';
import Keyframes from './Keyframes';
import { useTempo } from '@/ui/contexts/Tempo';
import { useScale } from '../ScaleContext';
import ChartJudgeline from '@/Chart/Judgeline';
import { TChartJudgelineProps } from '@/Chart/JudgelineProps';
import ChartKeyframe from '@/Chart/Keyframe';
import { BeatArray } from '@/utils/types';
import { useSelectedItem } from '@/ui/contexts/SelectedItem';

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
  const [ , setSelectedItem ] = useSelectedItem()!;

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

  const onKeyframeMove = useCallback((type: keyof TChartJudgelineProps, id: string, newBeat: BeatArray) => {
    setSelectedItem(null);
    line.editKeyframe(type, id, { beat: newBeat });
  }, [line, setSelectedItem]);

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

  const handleKeyframeSelected = useCallback((type: keyof TChartJudgelineProps, id: string) => {
    const keyframe = line.findKeyframeById(type, id);
    if (!keyframe) return;

    setSelectedItem({
      type: 'keyframe',
      line: line,
      propName: type,
      id: id,
    });
  }, [line, setSelectedItem]);

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
        onKeyframeSelected={handleKeyframeSelected}
        onDoubleClick={onAddKeyframe}
        onKeyframeMove={onKeyframeMove}
      />
      <Keyframes
        type='positionX'
        keyframes={lineProp.positionX}
        timeRange={timeRange}
        onKeyframeSelected={handleKeyframeSelected}
        onDoubleClick={onAddKeyframe}
        onKeyframeMove={onKeyframeMove}

      />
      <Keyframes
        type='positionY'
        keyframes={lineProp.positionY}
        timeRange={timeRange}
        onKeyframeSelected={handleKeyframeSelected}
        onDoubleClick={onAddKeyframe}
        onKeyframeMove={onKeyframeMove}
      />
      <Keyframes
        type='rotate'
        keyframes={lineProp.rotate}
        timeRange={timeRange}
        onKeyframeSelected={handleKeyframeSelected}
        onDoubleClick={onAddKeyframe}
        onKeyframeMove={onKeyframeMove}
      />
      <Keyframes
        type='alpha'
        keyframes={lineProp.alpha}
        timeRange={timeRange}
        onKeyframeSelected={handleKeyframeSelected}
        onDoubleClick={onAddKeyframe}
        onKeyframeMove={onKeyframeMove}
      />
    </>}
  </>
};

export default KeyframesRow;
