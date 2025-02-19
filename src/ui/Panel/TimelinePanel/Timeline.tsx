import { useEffect, useState } from 'react';
import SplitPane from 'react-split-pane';
import TimelineFooter from './Footer';
import App from '@/App/App';
import ChartJudgeline from '@/Chart/Judgeline';
import TimelineLeftPanel from './LeftPanel/LeftPanel';
import TimelineRightPanel from './RightPanel/RightPanel';
import './styles.css';

const Timeline: React.FC = () => {
  const [ timeLength, setTimeLength ] = useState(0);
  const [ lineList, setLineList ] = useState<ChartJudgeline[]>([]);
  const [ expandedLines, setExpandedLines ] = useState<number[]>([]);
  const [ listScrolled, setListScrolled ] = useState<number>(0);

  const setLineExpand = (lineId: number, isExpanded: boolean) => {
    if (isExpanded) setExpandedLines([ ...expandedLines, lineId ]);
    else setExpandedLines([ ...expandedLines.filter((e) => e !== lineId) ]);
  };

  useEffect(() => {
    const updateTimeLength = () => {
      setTimeLength(App.chart!.beatDuration);
    };

    App.events.once('chart.audioClip.loaded', updateTimeLength);
    App.events.on('chart.bpms.updated', updateTimeLength);

    return (() => {
      App.events.off('chart.bpms.updated', updateTimeLength);
    });
  }, []);

  useEffect(() => {
    const updateLineList = (newLines: ChartJudgeline[]) => {
      setLineList([ ...newLines ]);
    };
    App.events.on('chart.lines.updated', updateLineList);
    return (() => {
      App.events.off('chart.lines.updated', updateLineList);
    });
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
            overflowX: 'hidden',
            overflowY: 'visible',
          }}
        >
          <TimelineLeftPanel
            lines={lineList}
            expandedLines={expandedLines}
            listScrolled={listScrolled}
            onLineExpanded={(id, e) => setLineExpand(id, e)}
          />
            <TimelineRightPanel
              timeLength={timeLength}
              lines={lineList}
              expandedLines={expandedLines}
              listScrolled={listScrolled}
              onListScroll={setListScrolled}
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
          <></>
        }
      />
    </div>
  );
};

export default Timeline;
