import { useEffect, useState } from 'react';
import SplitPane from 'react-split-pane';
import TimelineFooter from './Footer';
import Chart from '@/Chart/Chart';
import ChartJudgeline from '@/Chart/Judgeline';
import TimelineLeftPanel from './LeftPanel/LeftPanel';
import TimelineRightPanel from './RightPanel/RightPanel';
import './styles.css';

const Timeline: React.FC = () => {
  const [ lineList, setLineList ] = useState<ChartJudgeline[]>([]);
  const [ expandedLines, setExpandedLines ] = useState<number[]>([]);
  const [ listScrolled, setListScrolled ] = useState<number>(0);

  const setLineExpand = (lineId: number, isExpanded: boolean) => {
    if (isExpanded) setExpandedLines([ ...expandedLines, lineId ]);
    else setExpandedLines([ ...expandedLines.filter((e) => e !== lineId) ]);
  };

  useEffect(() => {
    const updateLineList = (newLines: ChartJudgeline[]) => {
      setLineList([ ...newLines ]);
    };
    Chart.events.on('lines.updated', updateLineList);
    return (() => {
      Chart.events.off('lines.updated', updateLineList);
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
          </>
        }
      />
    </div>
  );
};

export default Timeline;
