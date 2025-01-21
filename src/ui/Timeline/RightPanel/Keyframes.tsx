import React, { useCallback, useMemo, useState } from 'react';
import TimelineListItem from '../List/Item';
import { useTempo } from '@/ui/contexts/Tempo';
import { useScale } from '../ScaleContext';
import { useSelectedItem } from '@/ui/contexts/SelectedItem';
import useDrag from '@/ui/hooks/useDrag';
import { setCSSProperties } from '@/utils/ui';
import { BeatNumberToArray } from '@/utils/math';
import ChartKeyframe from '@/Chart/Keyframe';
import { TChartJudgelineProps } from '@/Chart/JudgelineProps';
import { BeatArray } from '@/utils/types';

type KeyframeProps = {
  keyframe: ChartKeyframe,
  onSelected: (id: string) => void,
  onKeyframeMove: (id: string, newBeat: BeatArray) => void,
};

const Keyframe: React.FC<KeyframeProps> = ({
  keyframe,
  onSelected,
  onKeyframeMove,
}) => {
  const tempo = useTempo();
  const scale = useScale();
  const beatGrid = (1 / tempo) * scale;
  const [ selectedItem, ] = useSelectedItem()!;
  const [ currentTime, setCurrentTime ] = useState(keyframe.beatNum);

  const isSelected = () => {
    return selectedItem && selectedItem.type === 'keyframe' && selectedItem.id === keyframe.id
  };

  const calculateNewTime = useCallback((x: number) => {
    return keyframe.beatNum + (x / beatGrid / tempo);
  }, [keyframe, beatGrid, tempo]);

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

  const className = "timeline-content-key" + (isSelected() ? " selected" : "");

  return <div
    className={className}
    style={setCSSProperties({
      "--point-time": currentTime,
      "--point-value": keyframe.value,
    })}
    onMouseDown={onMouseDown}
  ></div>
};

export type TimelineRightPanelKeyframesProps = {
  type: keyof TChartJudgelineProps,
  keyframes: ChartKeyframe[],
  timeRange: [number, number],
  onKeyframeSelected: (type: keyof TChartJudgelineProps, id: string) => void,
  onDoubleClick: (type: keyof TChartJudgelineProps, clickedPosX: number) => void,
  onKeyframeMove: (type: keyof TChartJudgelineProps, id: string, newBeat: BeatArray) => void,
};

const TimelineRightPanelKeyframes: React.FC<TimelineRightPanelKeyframesProps> = ({
  type,
  keyframes,
  timeRange,
  onKeyframeSelected,
  onDoubleClick,
  onKeyframeMove,
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

  const keyframesDom = useMemo(() => {
    const result: React.ReactNode[] = [];

    for (let i = 0; i < keyframes.length; i++) {
      const keyframe = keyframes[i];
      if (keyframe.beatNum < timeRange[0]) continue;
      if (keyframe.beatNum > timeRange[1]) break;

      result.push(
        <Keyframe
          keyframe={keyframe}
          onSelected={handleKeyframeSelected}
          onKeyframeMove={handleKeyframeMove}
          key={keyframe.id}
        />
      );
    }

    return result;
  }, [keyframes, timeRange, handleKeyframeMove, handleKeyframeSelected]);

  return (
    <TimelineListItem onDoubleClick={onRowDoubleClick}>
      {keyframesDom}
    </TimelineListItem>
  );
};

export default TimelineRightPanelKeyframes;
