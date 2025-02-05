import React, { useCallback, useEffect, useState } from 'react';
import TimelineListItem from '../List/Item';
import Keyframes from './Keyframes';
import { useTempo } from '@/ui/contexts/Tempo';
import { useScale } from '../ScaleContext';
import ChartJudgeline from '@/Chart/Judgeline';
import { TChartJudgelineProps } from '@/Chart/JudgelineProps';
import ChartKeyframe from '@/Chart/Keyframe';
import { BeatArray, Nullable } from '@/utils/types';
import { useSelectedItem } from '@/ui/contexts/SelectedItem';
import { BeatArrayToNumber } from '@/utils/math';
import { selectLineState, selectLinePropsState } from '@/ui/store/selectors/chart';
import { useAppSelector } from '@/ui/store/hooks';

const getLastKeyframe = (beat: BeatArray, keyframes: ChartKeyframe[]): Nullable<ChartKeyframe> => {
  const time = BeatArrayToNumber(beat);

  for (let i = 0; i < keyframes.length; i++) {
    const keyframe = keyframes[i];
    if (keyframe.beatNum < time) continue;
    if (keyframe.beatNum > time) {
      if (i === 0) break;
      return keyframes[i - 1];
    }
  }

  return null;
}

type KeyframesRowProps = {
  lineID: string,
  isExpanded: boolean,
  timeRange: [number, number],
};

const KeyframesRow: React.FC<KeyframesRowProps> = ({
  lineID,
  isExpanded,
  timeRange,
}) => {
  const lineProps = useAppSelector((state) => selectLinePropsState(state, lineID))!;
  const line = useAppSelector((state) => selectLineState(state, lineID))!;
  const tempo = useTempo();
  const scale = useScale();
  const [ , setSelectedItem ] = useSelectedItem()!;

  const onAddKeyframe = useCallback((type: keyof TChartJudgelineProps, clickedPosX: number) => {
    const beat = clickedPosX / scale;
    let beatFloor = Math.floor(beat);
    let beatSub = Math.round((beat - beatFloor) * tempo);

    if (beatSub === tempo) {
      beatFloor += 1;
      beatSub = 0;
    }

    const beatArr: BeatArray = [ beatFloor, beatSub, tempo ];
    // const lastKeyframe = getLastKeyframe(beatArr, line.props[type]);
    // line.addKeyframe(
    //   type,
    //   beatArr,
    //   lastKeyframe ? lastKeyframe.value : 0,
    //   lastKeyframe ? lastKeyframe.continuous : false,
    //   lastKeyframe ? lastKeyframe.easing : 0
    // );
  }, [scale, tempo, line]);

  const onKeyframeMove = useCallback((type: keyof TChartJudgelineProps, id: string, newBeat: BeatArray) => {
    setSelectedItem((oldItem) => {
      if (oldItem !== null) return { ...oldItem, keyframe: null };
      else return null;
    });
    // line.editKeyframe(type, id, { beat: newBeat });
  }, [line, setSelectedItem]);

  const onKeyframeDeleted = useCallback((type: keyof TChartJudgelineProps, id: string) => {
    setSelectedItem((oldItem) => {
      if (oldItem !== null) return { ...oldItem, keyframe: null };
      else return null;
    });
    // line.deleteKeyframe(type, id);
  }, [line, setSelectedItem]);

  // const handlePropsUpdate = useCallback(({
  //   type,
  //   keyframes,
  // }: {
  //   type: keyof TChartJudgelineProps,
  //   keyframes: ChartKeyframe[],
  // }) => {
  //   const newProp: Partial<TChartJudgelineProps> = {};
  //   newProp[type] = keyframes;
  //   setLineProp({ ...lineProp, ...newProp });
  // }, [lineProp]);

  const handleKeyframeSelected = useCallback((type: keyof TChartJudgelineProps, id: string) => {
    // const keyframe = line.findKeyframeById(type, id);
    // if (!keyframe) return;

    // setSelectedItem({
    //   line,
    //   keyframe: {
    //     type, id
    //   },
    //   note: null,
    // });
  }, [line, setSelectedItem]);

  const keyframesProps = {
    timeRange,
    onKeyframeSelected: handleKeyframeSelected,
  };

  return <>
    <TimelineListItem />
    {isExpanded && <>
      <Keyframes
        lineID={lineID}
        type='speed'
        keyframes={lineProps.speed}
        {...keyframesProps}
      />
      <Keyframes
        lineID={lineID}
        type='positionX'
        keyframes={lineProps.positionX}
        {...keyframesProps}
      />
      <Keyframes
        lineID={lineID}
        type='positionY'
        keyframes={lineProps.positionY}
        {...keyframesProps}
      />
      <Keyframes
        lineID={lineID}
        type='rotate'
        keyframes={lineProps.rotate}
        {...keyframesProps}
      />
      <Keyframes
        lineID={lineID}
        type='alpha'
        keyframes={lineProps.alpha}
        {...keyframesProps}
      />
    </>}
  </>
};

export default KeyframesRow;
