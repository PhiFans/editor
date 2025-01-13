import React from 'react';
import BeatScale from './BeatScale';

export type RightPanelHeadProps = {
  timeRange: [number, number],
  tempo: number,
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void,
};

const RightPanelHead: React.FC<RightPanelHeadProps> = ({
  timeRange,
  tempo,
  onClick
}) => {
  return (
    <div
      className='timeline-panel-head timeline-panel-head-right'
      onClick={onClick}
    >
      <div className="timeline-scale-container">
        {new Array(Math.floor(Math.ceil(timeRange[1]) - Math.floor(timeRange[0]))).fill(0).map((_, index) => {
          return <BeatScale time={Math.floor(timeRange[0]) + index} tempo={tempo} key={index} />;
        })}
      </div>
    </div>
  );
};

export default RightPanelHead;
