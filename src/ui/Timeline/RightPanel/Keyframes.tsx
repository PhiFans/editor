import React, { useCallback, useEffect, useRef, useState } from 'react';
import TimelineListItem from '../List/Item';
import { useTempo } from '@/ui/contexts/Tempo';
import { useScale } from '../ScaleContext';
import ChartKeyframe from '@/Chart/Keyframe';
import { setCSSProperties } from '@/utils/ui';
import { parseDoublePrecist } from '@/utils/math';
import { TChartJudgelineProps } from '@/Chart/JudgelineProps';
import { BeatArray } from '@/utils/types';

type KeyframeProps = {
  index: number,
  time: number,
  value: number,
  onKeyframeMove: (index: number, newBeat: BeatArray) => void,
};

const Keyframe: React.FC<KeyframeProps> = ({
  index,
  time,
  value,
  onKeyframeMove,
}) => {
  const tempo = useTempo();
  const scale = useScale();
  const [ currentTime, setCurrentTime ] = useState(time);
  const isDragging = useRef(false);
  const dragStartPos = useRef(NaN);

  const handleDragStart = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    isDragging.current = true;
    dragStartPos.current = e.clientX;
  }, []);

  const handleDragMoving = useCallback((e: MouseEvent, emit = false) => {
    if (!isDragging.current) return;
    const currentDiff = (e.clientX - dragStartPos.current);
    const newBeat = (currentDiff / scale) + time;

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
    if (newBeatNum !== time && emit) {
      onKeyframeMove(index, [ newBeatFloor, newBeatSub, tempo ]);
      setCurrentTime(time);
    }
  }, [time, index, tempo, scale, onKeyframeMove]);

  const handleDragEnd = useCallback((e: MouseEvent) => {
    if (!isDragging.current) return;

    handleDragMoving(e, true);
    isDragging.current = false;
    dragStartPos.current = NaN;
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
      "--point-value": value,
    })}
    onMouseDown={handleDragStart}
  ></div>
};

type KeyframesProps = {
  timeRange: [number, number],
  keyframes: ChartKeyframe[],
  onKeyframeMove: (index: number, newBeat: BeatArray) => void,
};

const Keyframes: React.FC<KeyframesProps> = ({
  timeRange,
  keyframes,
  onKeyframeMove,
}) => {
  const result: React.ReactNode[] = [];

  for (let i = 0; i < keyframes.length; i++) {
    const keyframe = keyframes[i];
    if (keyframe.beatNum < timeRange[0]) continue;
    if (keyframe.beatNum > timeRange[1]) break;

    result.push(
      <Keyframe
        index={i}
        time={keyframe.beatNum}
        value={keyframe.value}
        onKeyframeMove={onKeyframeMove}
        key={keyframe.beatNum}
      />
    );
  }

  return result;
};

export type TimelineRightPanelKeyframesProps = {
  type: keyof TChartJudgelineProps,
  keyframes: ChartKeyframe[],
  timeRange: [number, number],
  onDoubleClick: (type: keyof TChartJudgelineProps, clickedPosX: number) => void,
  onKeyframeMove: (type: keyof TChartJudgelineProps, index: number, newBeat: BeatArray) => void,
};

const TimelineRightPanelKeyframes: React.FC<TimelineRightPanelKeyframesProps> = ({
  type,
  keyframes,
  timeRange,
  onDoubleClick,
  onKeyframeMove,
}: TimelineRightPanelKeyframesProps) => {
  const onRowDoubleClick = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const target = e.target as HTMLDivElement;
    const rect = target.getBoundingClientRect();
    onDoubleClick(type, e.clientX - rect.x);
  }, [type, onDoubleClick]);

  const handleKeyframeMove = useCallback((index: number, newBeat: BeatArray) => {
    onKeyframeMove(type, index, newBeat);
  }, [type, onKeyframeMove]);

  return <TimelineListItem onDoubleClick={onRowDoubleClick}>
    <Keyframes
      keyframes={keyframes}
      timeRange={timeRange}
      onKeyframeMove={handleKeyframeMove}
    />
  </TimelineListItem>
};

export default TimelineRightPanelKeyframes;
