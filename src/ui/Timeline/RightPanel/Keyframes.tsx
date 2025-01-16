import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import TimelineListItem from '../List/Item';
import { useTempo } from '@/ui/contexts/Tempo';
import { useScale } from '../ScaleContext';
import ChartKeyframe from '@/Chart/Keyframe';
import { setCSSProperties, setDragStyle } from '@/utils/ui';
import { parseDoublePrecist } from '@/utils/math';
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
  const [ currentTime, setCurrentTime ] = useState(keyframe.beatNum);
  const isDragging = useRef(false);
  const dragStartPos = useRef(NaN);

  const handleSelected = useCallback(() => {
    onSelected(keyframe.id);
  }, [keyframe, onSelected]);

  const handleDragStart = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    isDragging.current = true;
    dragStartPos.current = e.clientX;
    setDragStyle('horizontal');
  }, []);

  const handleDragMoving = useCallback((e: MouseEvent, emit = false) => {
    if (!isDragging.current) return;
    const currentDiff = (e.clientX - dragStartPos.current);
    const unclampedNewBeat = (currentDiff / scale) + keyframe.beatNum;
    const newBeat = unclampedNewBeat < 0 ? 0 : unclampedNewBeat;

    let newBeatFloor = Math.floor(newBeat);
    let newBeatSub = Math.round((newBeat - newBeatFloor) * tempo);

    if (newBeatSub === tempo) {
      newBeatFloor += 1;
      newBeatSub = 0;
    }

    const newBeatNum = parseDoublePrecist(
      newBeatFloor + (newBeatSub / tempo)
    , 6, -1);
    setCurrentTime(newBeatNum);
    if (newBeatNum !== keyframe.beatNum && emit) {
      onKeyframeMove(keyframe.id, [ newBeatFloor, newBeatSub, tempo ]);
      setCurrentTime(keyframe.beatNum);
    }
  }, [keyframe, tempo, scale, onKeyframeMove]);

  const handleDragEnd = useCallback((e: MouseEvent) => {
    if (!isDragging.current) return;

    handleDragMoving(e, true);
    isDragging.current = false;
    dragStartPos.current = NaN;
    setDragStyle();
  }, [handleDragMoving]);

  useEffect(() => {
    window.addEventListener('mousemove', handleDragMoving);
    window.addEventListener('mouseup', handleDragEnd);

    return (() => {
      window.removeEventListener('mousemove', handleDragMoving);
      window.removeEventListener('mouseup', handleDragEnd);
    });
  }, [handleDragEnd, handleDragMoving]);

  return <div
    className="timeline-content-key"
    style={setCSSProperties({
      "--point-time": currentTime,
      "--point-value": keyframe.value,
    })}
    onClick={handleSelected}
    onMouseDown={handleDragStart}
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
