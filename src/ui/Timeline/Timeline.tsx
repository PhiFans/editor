import SplitPane from 'react-split-pane';
import TimelineContent from './Content';
import TimelineList from './List';
import './styles.css';
import TimelineFooter from './Footer';
import App from '@/App/App';
import { useState } from 'react';

export type TimelineItemProp = {
  name: string;
  minValue: number;
  maxValue: number;
  defaultValue: number;
};

export type TimelineItem = {
  name: string;
  props: Record<string, TimelineItemProp>;
  values: Record<string, { time: number; value: number }[]>;
};

export type TimelineProps = {
  timeLength: number,
  items: TimelineItem[];
  onTimeChange?: (time: number) => void;
};

const Timeline: React.FC<TimelineProps> = ({ timeLength, items }: TimelineProps) => {
  const [ contentScale, setContentScale ] = useState(50);

  return (
    <div className="timeline">
      <div className='timeline-panel-container'>
        <SplitPane
          split="vertical"
          size={150}
          maxSize={400}
          className='timeline-panel'
          style={{
            height: "100%",
            overflowX: 'hidden',
            overflowY: 'visible',
          }}
        >
          <TimelineList items={items} />
          <TimelineContent timeLength={timeLength} scale={contentScale} items={items} />
        </SplitPane>
      </div>
      <TimelineFooter
        leftContent={[
          <button
            onClick={() => App.chart ? App.chart.play().catch(() => void 0) : void 0}
            key={'footer-left-play'}
          >
            Play
          </button>,
          <button
            onClick={() => App.chart ? App.chart.pause().catch(() => void 0) : void 0}
            key={'footer-left-pause'}
          >
            Pause
          </button>
        ]}
        rightContent={[
          <input
            type='range'
            min={1}
            max={100}
            defaultValue={50}
            onInput={(e) => setContentScale(101 - parseInt((e.nativeEvent.target as HTMLInputElement).value))}
            key={'footer-right-scale'}
          />
        ]}
      />
    </div>
  );
};

export default Timeline;
