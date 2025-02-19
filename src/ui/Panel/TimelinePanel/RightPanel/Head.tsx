import React, { useCallback } from 'react';
import BeatScale from './BeatScale';
import { useContext } from './Context';

export type RightPanelHeadProps = {
  onSeek: (time: number) => void,
};

const RightPanelHead: React.FC<RightPanelHeadProps> = ({
  onSeek
}) => {
  const { scale, timeRange } = useContext();
  const timeRangeStart = Math.floor(timeRange[0]);
  const timeRangeLength = Math.ceil(timeRange[1]) - timeRangeStart;

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const target = e.target as HTMLDivElement;
    const rect = target.getBoundingClientRect();
    const clickAtTime = (e.clientX - rect.x) / scale;

    onSeek(clickAtTime + timeRange[0]);
  }, [onSeek, scale, timeRange]);

  return (
    <div
      className='timeline-panel-head timeline-panel-head-right'
      onClick={handleClick}
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
