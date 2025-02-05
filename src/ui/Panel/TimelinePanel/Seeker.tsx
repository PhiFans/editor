import React, { useRef } from 'react';
import { useClockTime } from '../contexts/Clock';
import { useScale } from './ScaleContext';
import useDrag from '../hooks/useDrag';
import { Point } from '@/utils/types';

export type TimelineSeekerProps = {
  timeLength: number;
  onSeek: (newTime: number) => void;
};

const TimelineSeeker: React.FC<TimelineSeekerProps> = ({
  timeLength,
  onSeek,
}: TimelineSeekerProps) => {
  const currentTime = useClockTime().beat;
  const scale = useScale();
  const handleStartTime = useRef(NaN);

  const handleMouseMove = ({ x }: Point) => {
    if (isNaN(handleStartTime.current)) handleStartTime.current = currentTime;

    const timeBetween = x / scale;
    const newTime = handleStartTime.current + timeBetween;

    if (newTime > timeLength) onSeek(timeLength);
    else if (newTime < 0) onSeek(0);
    else onSeek(newTime);
  };

  const handleMouseUp = (point: Point) => {
    handleMouseMove(point);
    handleStartTime.current = NaN;
  };

  const { onMouseDown } = useDrag({
    allowY: false,
    onDrag: handleMouseMove,
    onDragEnd: handleMouseUp,
  });

  return (
    <div
      className="timeline-time-seeker"
      style={{
        "--current-time": currentTime,
      } as React.CSSProperties}
    >
      <div
        className="timeline-time-seeker-handle"
        onMouseDown={onMouseDown}
      ></div>
    </div>
  );
};

export default React.memo(TimelineSeeker);
