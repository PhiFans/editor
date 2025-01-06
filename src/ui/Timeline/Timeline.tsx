import SplitPane from 'react-split-pane';
import TimelineContent from './Content';
import TimelineList from './List';
import './styles.css';

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
  items: TimelineItem[];
  onTimeChange?: (time: number) => void;
};

const Timeline: React.FC<TimelineProps> = ({ items }: TimelineProps) => {
  const contentScale = 50;

  return (
    <div className="timeline">
      <SplitPane
        split="vertical"
        size={150}
        maxSize={400}
        style={{
          position: "relative",
          height: "calc(100% - 26px)",
        }}
      >
        <TimelineList items={items} />
        <TimelineContent timeLength={120} scale={contentScale} items={items} />
      </SplitPane>
    </div>
  );
};

export default Timeline;
