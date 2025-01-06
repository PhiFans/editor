import React from 'react';
import TimelineKey, { TimelineKeyInfo } from "./Key";

const TimelineKeyTrack = React.memo((({ items }) => {
  if (items.length === 0) return <div className="timeline-list-item"></div>;
  return (
    <div className="timeline-list-item">
      {items.map((value) => {
        return (
          <TimelineKey
            key={`${value.parentName}-${value.type}-${value.time}-${value.value}`}
            parentIndex={value.parentIndex}
            parentName={value.parentName}
            type={value.type}
            time={value.time}
            value={value.value}
          />
        );
      })}
    </div>
  );
}) as React.FC<{ items: TimelineKeyInfo[] }>);

export default TimelineKeyTrack;
