import React, { useCallback, useEffect, useRef } from 'react';
import { useClockTime } from '../contexts/Clock';
import { useScale } from './ScaleContext';
import { setDragStyle } from '@/utils/ui';

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
  const isHandling = useRef(false);
  const handleStartPosX = useRef(0);
  const handleStartTime = useRef(0);

  const onHandlerHold = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (isHandling.current) return;

    isHandling.current = true;
    handleStartPosX.current = e.screenX;
    handleStartTime.current = currentTime;
    setDragStyle('horizontal');
  }, [currentTime]);

  const onHandlerMove = useCallback((e: MouseEvent) => {
    if (!isHandling.current) return;
    const posBetween = e.screenX - handleStartPosX.current;
    const timeBetween = posBetween / scale;
    const newTime = handleStartTime.current + timeBetween;

    if (newTime > timeLength) onSeek(timeLength);
    else if (newTime < 0) onSeek(0);
    else onSeek(newTime);
  }, [scale, timeLength, onSeek]);

  const onHandlerUnhold = useCallback((e: MouseEvent) => {
    if (!isHandling.current) return;
    onHandlerMove(e);

    isHandling.current = false;
    handleStartPosX.current = 0;
    handleStartTime.current = 0;
    setDragStyle();
  }, [onHandlerMove]);

  useEffect(() => {
    document.addEventListener("mousemove", onHandlerMove);
    document.addEventListener("mouseup", onHandlerUnhold);

    return () => {
      document.removeEventListener("mousemove", onHandlerMove);
      document.removeEventListener("mouseup", onHandlerUnhold);
    };
  }, [scale, timeLength, onHandlerMove, onHandlerUnhold]);

  return (
    <div
      className="timeline-time-seeker"
      style={{
        "--current-time": currentTime,
      } as React.CSSProperties}
    >
      <div
        className="timeline-time-seeker-handle"
        onMouseDown={onHandlerHold}
      ></div>
    </div>
  );
};

export default React.memo(TimelineSeeker);
