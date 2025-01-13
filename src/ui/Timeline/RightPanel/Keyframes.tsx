import React, { useCallback, useEffect, useRef, useState } from 'react';
import TimelineListItem from '../List/Item';
import { useTempo } from '@/ui/contexts/Tempo';
import { useScale } from '../ScaleContext';
import ChartKeyframe from '@/Chart/Keyframe';
import { setCSSProperties } from '@/utils/ui';
import { parseDoublePrecist } from '@/utils/math';

type KeyframeProps = {
  time: number,
  value: number,
};

const Keyframe: React.FC<KeyframeProps> = ({
  time,
  value,
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

  const handleDragMoving = useCallback((e: MouseEvent) => {
    if (!isDragging.current) return;
    const currentDiff = (e.clientX - dragStartPos.current);
    const newBeat = (currentDiff / scale) + time;

    let newBeatFloor = Math.floor(newBeat);
    let newBeatSub = Math.round((newBeat - newBeatFloor) * tempo);

    if (newBeatSub === tempo) {
      newBeatFloor += 1;
      newBeatSub = 0;
    }

    setCurrentTime(parseDoublePrecist(
      newBeatFloor + (newBeatSub / tempo)
    , 6, -1));
  }, [time, tempo, scale]);

  const handleDragEnd = useCallback((e: MouseEvent) => {
    if (!isDragging.current) return;

    handleDragMoving(e);
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
};

const Keyframes: React.FC<KeyframesProps> = ({
  timeRange,
  keyframes,
}) => {
  const result: React.ReactNode[] = [];

  for (const keyframe of keyframes) {
    if (keyframe.beatNum < timeRange[0]) continue;
    if (keyframe.beatNum > timeRange[1]) break;

    result.push(
      <Keyframe time={keyframe.beatNum} value={keyframe.value} key={keyframe.beatNum} />
    );
  }

  return result;
};

export type TimelineRightPanelKeyframesProps = {
  keyframes: ChartKeyframe[],
  timeRange: [number, number],
  onDoubleClick: (clickedPosX: number) => void,
};

const TimelineRightPanelKeyframes: React.FC<TimelineRightPanelKeyframesProps> = ({
  keyframes,
  timeRange,
  onDoubleClick,
}: TimelineRightPanelKeyframesProps) => {
  const onRowDoubleClick = (e: MouseEvent) => {
    const target = e.target as HTMLDivElement;
    const rect = target.getBoundingClientRect();
    onDoubleClick(e.clientX - rect.x);
  };

  return <TimelineListItem onDoubleClick={(e) => onRowDoubleClick(e.nativeEvent)}>
    <Keyframes keyframes={keyframes} timeRange={timeRange} />
  </TimelineListItem>
};

export default TimelineRightPanelKeyframes;
