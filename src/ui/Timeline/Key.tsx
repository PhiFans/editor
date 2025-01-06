import { setCSSProperties } from '@/utils/ui';

export type TimelineKeyInfo = {
  parentIndex: number;
  parentName: string;
  type: string;
  time: number;
  value: number;
};

export type TimelineKeyProps = TimelineKeyInfo & {
  onSelect?: (info: TimelineKeyInfo) => void
};

const TimelineKey: React.FC<TimelineKeyProps> = ({
  parentIndex,
  parentName,
  type,
  time,
  value,
  onSelect
}: TimelineKeyProps) => {
  const onClick = () => {
    console.log({ parentIndex, parentName, type, time, value });
    if (!onSelect) return;
    onSelect({ parentIndex, parentName, type, time, value });
  };

  return (
    <div
      className="timeline-content-key"
      style={setCSSProperties({
        "--point-time": time,
        "--point-value": value ?? 0,
      })}
      onClick={() => onClick()}
    ></div>
  );
};

export default TimelineKey;
