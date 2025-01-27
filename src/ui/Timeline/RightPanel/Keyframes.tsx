import React, { useCallback, useEffect, useMemo, useState } from 'react';
import TimelineListItem from '../List/Item';
import { useTempo } from '@/ui/contexts/Tempo';
import { useScale } from '../ScaleContext';
import { useSelectedItem } from '@/ui/contexts/SelectedItem';
import useDrag from '@/ui/hooks/useDrag';
import { setCSSProperties } from '@/utils/ui';
import { BeatNumberToArray, GridValue, parseDoublePrecist } from '@/utils/math';
import ChartKeyframe from '@/Chart/Keyframe';
import { TChartJudgelineProps } from '@/Chart/JudgelineProps';
import { BeatArray, Nullable } from '@/utils/types';

type KeyframeProps = {
  keyframe: ChartKeyframe,
  time: number,
  nextTime: Nullable<number>,
  onSelected: (id: string) => void,
  onKeyframeMove: (id: string, newBeat: BeatArray) => void,
  onRightClicked: (id: string) => void,
};

const Keyframe: React.FC<KeyframeProps> = ({
  keyframe,
  time,
  nextTime,
  onSelected,
  onKeyframeMove,
  onRightClicked,
}) => {
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
    return GridValue(keyframe.beatNum + (x / beatGrid / tempo), tempoGrid);
  }, [keyframe, beatGrid, tempo, tempoGrid]);

  const handleDragging = useCallback(({ x }: { x: number }) => {
    setCurrentTime(calculateNewTime(x));
  }, [calculateNewTime]);

  const handleDragEnd = useCallback(({ x }: { x: number }) => {
    const newTime = calculateNewTime(x);

    setCurrentTime(newTime);
    onKeyframeMove(keyframe.id, BeatNumberToArray(newTime, tempo));
  }, [calculateNewTime, keyframe.id, onKeyframeMove, tempo]);

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

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.button === 2) return onRightClicked(keyframe.id);
    else return onMouseDown(e);
  }, [keyframe.id, onRightClicked, onMouseDown]);

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
  type: keyof TChartJudgelineProps,
  keyframes: ChartKeyframe[],
  timeRange: [number, number],
  onKeyframeSelected: (type: keyof TChartJudgelineProps, id: string) => void,
  onDoubleClick: (type: keyof TChartJudgelineProps, clickedPosX: number) => void,
  onKeyframeMove: (type: keyof TChartJudgelineProps, id: string, newBeat: BeatArray) => void,
  onKeyframeDeleted: (type: keyof TChartJudgelineProps, id: string) => void,
};

const TimelineRightPanelKeyframes: React.FC<TimelineRightPanelKeyframesProps> = ({
  type,
  keyframes,
  timeRange,
  onKeyframeSelected,
  onDoubleClick,
  onKeyframeMove,
  onKeyframeDeleted,
}: TimelineRightPanelKeyframesProps) => {
  const handleKeyframeSelected = useCallback((id: string) => {
    onKeyframeSelected(type, id);
  }, [type, onKeyframeSelected]);

  const onRowDoubleClick = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const target = e.target as HTMLDivElement;
    const rect = target.getBoundingClientRect();
    onDoubleClick(type, e.clientX - rect.x);
  }, [type, onDoubleClick]);

  const handleKeyframeMove = useCallback((id: string, newBeat: BeatArray) => {
    onKeyframeMove(type, id, newBeat);
  }, [type, onKeyframeMove]);

  const handleKeyframeRightClick = useCallback((id: string) => {
    onKeyframeDeleted(type, id);
  }, [type, onKeyframeDeleted]);

  const keyframesDom = useMemo(() => {
    const result: React.ReactNode[] = [];

    for (let i = 0; i < keyframes.length; i++) {
      const keyframe = keyframes[i];
      if (keyframe.beatNum < timeRange[0]) continue;
      if (keyframe.beatNum > timeRange[1]) break;

      result.push(
        <Keyframe
          keyframe={keyframe}
          time={keyframe.beatNum}
          nextTime={keyframe.nextKeyframe ? keyframe.nextKeyframe.beatNum : null}
          onSelected={handleKeyframeSelected}
          onKeyframeMove={handleKeyframeMove}
          onRightClicked={handleKeyframeRightClick}
          key={keyframe.id}
        />
      );
    }

    return result;
  }, [keyframes, timeRange, handleKeyframeMove, handleKeyframeSelected, handleKeyframeRightClick]);

  return (
    <TimelineListItem onDoubleClick={onRowDoubleClick}>
      {keyframesDom}
    </TimelineListItem>
  );
};

export default TimelineRightPanelKeyframes;
