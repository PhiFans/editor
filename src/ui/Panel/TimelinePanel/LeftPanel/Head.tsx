import { useClockTime } from "@/ui/contexts/Clock";
import { FillZero } from "@/utils/math";

// XXX: Move to somewhere else?
const timeToString = (time: number) => {
  const seconds = Math.floor(time) % 60;
  const minutes = Math.floor(time / 60);
  const milliseconds = Math.floor((time - Math.floor(time)) * 1000);
  return `${FillZero(minutes)}:${FillZero(seconds)}.${FillZero(milliseconds, 3)}`;
};

const LeftPanelHead = () => {
  return <div
    className='timeline-panel-head timeline-panel-head-left'
  >
    <div className="timeline-head-current-time">
      <div className="current-time">{timeToString(useClockTime().time)}</div>
    </div>
  </div>;
};

export default LeftPanelHead;
