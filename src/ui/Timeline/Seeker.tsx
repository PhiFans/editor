import { useEffect, useRef } from 'react';
import { setCSSProperties } from '@/utils/ui';

export type TimelineSeekerProps = {
  currentTime: number;
  timeLength: number;
  scale: number;
  onSeek: (newTime: number) => void;
};

const TimelineSeeker: React.FC<TimelineSeekerProps> = ({
  currentTime,
  timeLength,
  scale,
  onSeek,
}: TimelineSeekerProps) => {
  const isHandling = useRef(false);
  const handleStartPosX = useRef(0);
  const handleStartTime = useRef(0);

  const onHandlerHold = (e: MouseEvent) => {
    if (isHandling.current) return;

    isHandling.current = true;
    handleStartPosX.current = e.screenX;
    handleStartTime.current = currentTime;
  };

  const onHandlerMove = (e: MouseEvent) => {
    if (!isHandling.current) return;
    const posBetween = e.screenX - handleStartPosX.current;
    const timeBetween = posBetween / scale;
    const newTime = handleStartTime.current + timeBetween;
    if (newTime > timeLength) onSeek(timeLength);
    else if (newTime < 0) onSeek(0);
    else onSeek(newTime);
  };

  const onHandlerUnhold = (e: MouseEvent) => {
    if (!isHandling.current) return;
    onHandlerMove(e);

    isHandling.current = false;
    handleStartPosX.current = 0;
    handleStartTime.current = 0;
  };

  useEffect(() => {
    document.addEventListener("mousemove", onHandlerMove);
    document.addEventListener("mouseup", onHandlerUnhold);

    return () => {
      document.removeEventListener("mousemove", onHandlerMove);
      document.removeEventListener("mouseup", onHandlerUnhold);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scale, timeLength]);

  return (
    <div
      className="timeline-time-seeker"
      style={setCSSProperties({
        "--current-time": currentTime,
      })}
    >
      <div
        className="timeline-time-seeker-handle"
        onMouseDown={(e) => onHandlerHold(e.nativeEvent)}
      ></div>
    </div>
  );
};

export default TimelineSeeker;
