import { useEffect, useState } from 'react';
import SplitPane from 'react-split-pane';
import { Ticker } from 'pixi.js';
import TimelineFooter from './Footer';
import App from '@/App/App';
import ChartJudgeline from '@/Chart/Judgeline';
import TimelineLeftPanel from './LeftPanel/LeftPanel';
import TimelineRightPanel from './RightPanel/RightPanel';
import './styles.css';

export type TimelineItemProp = {
  name: string;
  minValue?: number;
  maxValue?: number;
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
  const [ lineList, setLineList ] = useState<ChartJudgeline[]>([]);
  const [ currentTime, setCurrentTime ] = useState(0);
  const [ contentScale, setContentScale ] = useState(50);

  useEffect(() => {
    const updateLineList = (newLine: ChartJudgeline) => {
      setLineList([ ...lineList, newLine ]);
    };
    App.events.on('chart.lines.added', updateLineList);
    return (() => {
      App.events.off('chart.lines.added', updateLineList);
    });
  }, [lineList]);

  useEffect(() => {
    const ticker = Ticker.shared;
    const updateTime = () => {
      if (!App.chart) return;
      setCurrentTime(App.chart.time);
    };
    ticker.add(updateTime);

    return () => {
      ticker.remove(updateTime);
    };
  }, []);

  return (
    <div className="timeline">
      <div className='timeline-panel-container'>
        <SplitPane
          split="vertical"
          size={150}
          maxSize={400}
          className='timeline-panel'
          style={{
            position: 'relative',
            minHeight: '50px',
            overflowX: 'hidden',
            overflowY: 'visible',
          }}
        >
          <TimelineLeftPanel
            currentTime={currentTime}
            lines={lineList}
          />
          <TimelineRightPanel
            currentTime={currentTime}
            timeLength={timeLength}
            scale={contentScale}
            lines={lineList}
            onSeek={(e) => {
              if (!App.chart) return;
              App.chart.seek(e).catch(() => void 0);
            }}
          />
        </SplitPane>
      </div>
      <TimelineFooter
        leftContent={
          <>
            <button
              onClick={() => App.chart ? App.chart.addLine() : void 0}
            >
              Add line
            </button>
            <span className='hr'>|</span>
            <button
              onClick={() => App.chart ? App.chart.play().catch(() => void 0) : void 0}
            >
              Play
            </button>
            <button
              onClick={() => App.chart ? App.chart.pause().catch(() => void 0) : void 0}
            >
              Pause
            </button>
          </>
        }
        rightContent={
          <>
            <input
              type='range'
              min={1}
              max={100}
              defaultValue={50}
              onInput={(e) => setContentScale(101 - parseInt((e.nativeEvent.target as HTMLInputElement).value))}
              key={'footer-right-scale'}
            />
          </>
        }
      />
    </div>
  );
};

export default Timeline;
