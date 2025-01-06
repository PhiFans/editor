import { useRef, useState } from 'react';
import { setCSSProperties } from "@/utils/ui";
import { TimelineItem } from './Timeline';
import { TimelineKeyInfo } from './Key';
import TimelineKeyTrack from './KeyTrack';
import TimelineSeeker from './Seeker';

export type TimelineContentProps = {
  timeLength: number;
  items: TimelineItem[];
  scale?: number;
};

const TimelineContent: React.FC<TimelineContentProps> = ({
  timeLength,
  items,
  scale
}: TimelineContentProps) => {
  const [currentTime, setCurrentTime] = useState(3);
  const containerRef = useRef(null);

  // TODO: Sync to audio time
  // useEffect(() => {
  //   const clockId = setInterval(() => {
  //     setCurrentTime(clock.time);
  //   }, 0);

  //   return () => clearInterval(clockId);
  // }, []);

  return (
    <div
      className="timeline-content-container"
      style={setCSSProperties({
        "--base-scale": scale ?? 10,
      })}
      ref={containerRef}
    >
      <div
        className="timeline-list timeline-content"
        style={setCSSProperties({
          "--time-length": timeLength,
        })}
      >
        <div className="timeline-list-item timeline-content-time-meter"></div>
        {items.map((item, index) => {
          const valuesTotal: TimelineKeyInfo[] = [];

          for (const name in item.values) {
            const rawValues = item.values[name];
            if (!rawValues || rawValues.length === 0) continue;

            valuesTotal.push(
              ...rawValues.map((rawValue) => ({
                parentIndex: index,
                parentName: item.name,
                type: name,
                time: rawValue.time,
                value: rawValue.value,
              }))
            );
          }

          return (
            <TimelineKeyTrack
              key={`#${index}.${item.name}`}
              items={valuesTotal}
            />
          );
        })}
      </div>
      <TimelineSeeker
        currentTime={currentTime}
        timeLength={timeLength}
        scale={scale ?? 10}
        onSeek={(e) => {
          // TODO: Sync to audio time
          // clock.seek(e);
          setCurrentTime(e);
        }}
      />
    </div>
  );
};

export default TimelineContent;
