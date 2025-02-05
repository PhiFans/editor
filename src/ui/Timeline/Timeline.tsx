import { useEffect, useState } from 'react';
import SplitPane from 'react-split-pane';
import TimelineFooter from './Footer';
import App from '@/App/App';
import ChartJudgeline from '@/Chart/Judgeline';
import { addLine } from '../store/slices/chart';
import TimelineLeftPanel from './LeftPanel/LeftPanel';
import TimelineRightPanel from './RightPanel/RightPanel';
import ScaleContext from './ScaleContext';
import './styles.css';
import { useAppDispatch } from '../store/hooks';

const Timeline: React.FC = () => {
  const dispatch = useAppDispatch();
  const [ timeLength, setTimeLength ] = useState(0);
  const [ lineList, setLineList ] = useState<ChartJudgeline[]>([]);
  const [ expandedLines, setExpandedLines ] = useState<number[]>([]);
  const [ contentScale, setContentScale ] = useState(205);

  const setLineExpand = (lineId: number, isExpanded: boolean) => {
    if (isExpanded) setExpandedLines([ ...expandedLines, lineId ]);
    else setExpandedLines([ ...expandedLines.filter((e) => e !== lineId) ]);
  };

  const updateContentScale = (scale: number) => {
    setContentScale(10 + (scale / 100) * 390);
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
            minHeight: '50px',
            overflowX: 'hidden',
            overflowY: 'visible',
          }}
        >
          <TimelineLeftPanel
            expandedLines={expandedLines}
            onLineExpanded={(id, e) => setLineExpand(id, e)}
          />
          <ScaleContext.Provider value={contentScale}>
            <TimelineRightPanel
              timeLength={timeLength}
              lines={lineList}
              expandedLines={expandedLines}
            />
          </ScaleContext.Provider>
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
            <button
              onClick={() => dispatch(addLine())}
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
              min={0}
              max={100}
              defaultValue={50}
              onChange={(e) => updateContentScale(100 - parseInt(e.target.value))}
              key={'footer-right-scale'}
            />
          </>
        }
      />
    </div>
  );
};

export default Timeline;
