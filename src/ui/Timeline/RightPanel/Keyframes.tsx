import React, { useCallback, useEffect, useMemo, useState } from 'react';
import TimelineListItem from '../List/Item';
import { useTempo } from '@/ui/contexts/Tempo';
import { useScale } from '../ScaleContext';
import { useSelectedItem } from '@/ui/contexts/SelectedItem';
import useDrag from '@/ui/hooks/useDrag';
import { setCSSProperties } from '@/utils/ui';
import { BeatArrayToNumber, BeatNumberToArray, GridValue, parseDoublePrecist } from '@/utils/math';
import { ChartJudglineProps, ChartKeyframe } from '@/Chart/types';
import { TChartJudgelineProps } from '@/Chart/JudgelineProps';
import { BeatArray, Nullable } from '@/utils/types';
import { useAppDispatch, useAppSelector } from '@/ui/store/hooks';
import { selectKeyframeState, selectLinePropState } from '@/ui/store/selectors/chart';
import { addKeyframe, editKeyframe, removeKeyframe } from '@/ui/store/slices/chart';

type KeyframeProps = {
  lineID: string,
  type: keyof ChartJudglineProps,
  id: string,
  nextTime: Nullable<number>,
  onSelected: (id: string) => void,
};

const Keyframe: React.FC<KeyframeProps> = ({
  lineID,
  type,
  id,
  nextTime,
  onSelected,
}) => {
  const dispatch = useAppDispatch();
  const keyframe = useAppSelector((state) => selectKeyframeState(state, lineID, type, id));
  if (!keyframe) return;

  const time = BeatArrayToNumber(keyframe.time);
  const tempo = useTempo();
  const scale = useScale();
  const tempoGrid = useMemo(() => parseDoublePrecist(1 / tempo, 6, -1), [tempo]);
  const beatGrid = useMemo(() => tempoGrid * scale, [tempoGrid, scale]);
  const [ selectedItem, ] = useSelectedItem()!;
  const [ currentTime, setCurrentTime ] = useState(time);

  const isSelected = () => {
    if (selectedItem === null) return false;
    if (selectedItem.keyframe === null) return false;
    if (selectedItem.keyframe instanceof Array) {
      return selectedItem.keyframe.findIndex((e) => e.id === keyframe.id) !== -1;
    } else {
      return selectedItem.keyframe.id === keyframe.id;
    };
  };

  const calculateNewTime = useCallback((x: number) => {
    return GridValue(time + (x / beatGrid / tempo), tempoGrid);
  }, [time, beatGrid, tempo, tempoGrid]);

  const handleDragging = ({ x }: { x: number }) => {
    setCurrentTime(calculateNewTime(x));
  };

  const handleDragEnd = ({ x }: { x: number }) => {
    const newTime = calculateNewTime(x);
    const newBeat = BeatNumberToArray(newTime, tempo);

    setCurrentTime(newTime);
    dispatch(editKeyframe({
      lineID,
      type,
      id,
      time: newBeat,
    }));
  };

  const handleSelected = useCallback(() => {
    onSelected(keyframe.id);
  }, [keyframe.id, onSelected]);

  const { onMouseDown } = useDrag({
    allowY: false,
    grid: beatGrid,
    onDrag: handleDragging,
    onDragEnd: handleDragEnd,
    onClick: handleSelected,
  });

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.button === 2) {
      dispatch(removeKeyframe({
        lineID,
        type,
        id,
      }));
    } else return onMouseDown(e);
  };

  useEffect(() => {
    setCurrentTime(time);
  }, [time]);

  const className = "timeline-content-key" + (isSelected() ? " selected" : "");

  return (
    <>
      <div
        className={className}
        style={setCSSProperties({
          "--point-time": currentTime,
          "--point-value": keyframe.value,
        })}
        onMouseDown={handleMouseDown}
      />
      {nextTime !== null && (
        <div
          className='timeline-content-key-connector'
          style={setCSSProperties({
            "--start-time": currentTime,
            "--end-time": nextTime,
          })}
        />
      )}
    </>
  )
};

export type TimelineRightPanelKeyframesProps = {
  lineID: string,
  type: keyof TChartJudgelineProps,
  keyframes: ChartKeyframe[],
  timeRange: [number, number],
  onKeyframeSelected: (type: keyof TChartJudgelineProps, id: string) => void,
};

const TimelineRightPanelKeyframes: React.FC<TimelineRightPanelKeyframesProps> = ({
  lineID,
  type,
  timeRange,
  onKeyframeSelected,
}: TimelineRightPanelKeyframesProps) => {
  const dispatch = useAppDispatch();
  const keyframes = useAppSelector((state) => selectLinePropState(state, lineID, type));
  const tempo = useTempo();
  const scale = useScale();

  const handleKeyframeSelected = useCallback((id: string) => {
    onKeyframeSelected(type, id);
  }, [type, onKeyframeSelected]);

  // const onRowDoubleClick = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
  //   const target = e.target as HTMLDivElement;
  //   const rect = target.getBoundingClientRect();
  //   console.log(e.clientX - rect.x);
  //   addKeyframe({
  //     lineID,
  //     type,
  //     time: [ 1, 0, 1 ],
  //     value: 1,
  //     continuous: false,
  //     easing: 0,
  //   });
  //   // onDoubleClick(type, e.clientX - rect.x);
  // }, [type, addKeyframe, onDoubleClick]);

  const onRowDoubleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const target = e.target as HTMLDivElement;
    const rect = target.getBoundingClientRect();
    const time = BeatNumberToArray((e.clientX - rect.x) / scale, tempo)

    dispatch(addKeyframe({
      lineID: lineID,
      type: type,
      time: time,
      value: 1,
      continuous: false,
      easing: 0,
    }));
  };

  const keyframesDom = useMemo(() => {
    const result: React.ReactNode[] = [];

    for (let i = 0; i < keyframes.length; i++) {
      const keyframe = keyframes[i];
      const time = BeatArrayToNumber(keyframe.time);

      if (time < timeRange[0]) continue;
      if (time > timeRange[1]) break;

      result.push(
        <Keyframe
          lineID={lineID}
          type={type}
          id={keyframe.id}
          // TODO: Next keyframe
          nextTime={null}
          onSelected={handleKeyframeSelected}
          key={keyframe.id}
        />
      );
    }

    return result;
  }, [keyframes, timeRange, handleKeyframeSelected]);

  return (
    <TimelineListItem onDoubleClick={onRowDoubleClick}>
      {keyframesDom}
    </TimelineListItem>
  );
};

export default TimelineRightPanelKeyframes;
