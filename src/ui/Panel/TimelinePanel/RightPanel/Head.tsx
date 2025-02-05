import React from 'react';
import BeatScale from './BeatScale';

export type RightPanelHeadProps = {
  timeRange: [number, number],
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void,
};

const RightPanelHead: React.FC<RightPanelHeadProps> = ({
  timeRange,
  onClick
}) => {
  const timeRangeStart = Math.floor(timeRange[0]);
  const timeRangeLength = Math.ceil(timeRange[1]) - timeRangeStart;

  return (
    <div
      className='timeline-panel-head timeline-panel-head-right'
      onClick={onClick}
    >
      <div className="timeline-scale-container">
        {new Array(timeRangeLength).fill(0).map((_, index) => {
          return <BeatScale time={timeRangeStart + index} key={timeRangeStart + index} />;
        })}
      </div>
    </div>
  );
};

export default RightPanelHead;
