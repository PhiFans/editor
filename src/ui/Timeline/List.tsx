import { TimelineItem } from './Timeline';

export type TimelineListProps = {
  items: TimelineItem[],
};

const TimelineList: React.FC<TimelineListProps> = ({
  items,
}: TimelineListProps) => {
  return (
    <div className="timeline-list">
      <div className="timeline-list-item"></div>
      {items.map((item, index) => {
        return (
          <div key={`#${index}.${item.name}`} className="timeline-list-item">
            {item.name}
          </div>
        );
      })}
    </div>
  );
};

export default TimelineList;
