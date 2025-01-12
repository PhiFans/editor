import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useClockTime } from '@/ui/contexts/Clock';
import App from '@/App/App';
import ChartJudgeline from "@/Chart/Judgeline";
import TimelineList from "../List/List";
import TimelineListItem from '../List/Item';
import TimelineSeeker from '../Seeker';
import Keyframes from './Keyframes';
import { setCSSProperties } from "@/utils/ui";
import ChartJudgelineProps from '@/Chart/JudgelineProps';
import './styles.css';
import BeatScale from './BeatScale';

type KeyframesRowProps = {
  line: ChartJudgeline,
  isExpanded: boolean,
  scale: number,
  tempo: number,
  timeRange: [number, number],
};

const KeyframesRow: React.FC<KeyframesRowProps> = ({
  line,
  isExpanded,
  scale,
  tempo,
  timeRange,
}) => {
  const onAddKeyframe = (type: keyof ChartJudgelineProps, clickedPosX: number) => {
    const beat = clickedPosX / scale;
    let beatFloor = Math.floor(beat);
    let beatSub = Math.round((beat - beatFloor) * tempo);

    if (beatSub === tempo) {
      beatFloor += 1;
      beatSub = 0;
    }

    line.addKeyframe(type, [ beatFloor, beatSub, tempo ], 1, false, 1);
  };

  return <>
    <TimelineListItem />
    {isExpanded && <>
      <Keyframes
        keyframes={line.props.speed}
        timeRange={timeRange}
        onDoubleClick={((b) => onAddKeyframe('speed', b))}
      />
      <Keyframes
        keyframes={line.props.positionX}
        timeRange={timeRange}
        onDoubleClick={((b) => onAddKeyframe('positionX', b))}
      />
      <Keyframes
        keyframes={line.props.positionY}
        timeRange={timeRange}
        onDoubleClick={((b) => onAddKeyframe('positionY', b))}
      />
      <Keyframes
        keyframes={line.props.rotate}
        timeRange={timeRange}
        onDoubleClick={((b) => onAddKeyframe('rotate', b))}
      />
      <Keyframes
        keyframes={line.props.alpha}
        timeRange={timeRange}
        onDoubleClick={((b) => onAddKeyframe('alpha', b))}
      />
    </>}
  </>
};

export type TimelineRightPanelProps = {
  timeLength: number,
  scale: number,
  lines: ChartJudgeline[],
  expandedLines: number[],
  tempo: number,
};

const TimelineRightPanel: React.FC<TimelineRightPanelProps> = ({
  timeLength,
  scale,
  lines,
  expandedLines,
  tempo,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const containerWidth = useRef(0);
  const containerScrolled = useRef(0);
  const [ timeRange, setTimeRange ] = useState<[number, number]>([ 0, 0 ]);

  const updateTimeRange = useCallback(() => {
    const start = Math.floor(containerScrolled.current / scale);
    const end = Math.ceil(containerWidth.current / scale) + start + 1;
    setTimeRange([ start, end ]);
  }, [scale]);

  const onContainerScrolled = (e: UIEvent) => {
    const target = e.target as HTMLDivElement;
    containerScrolled.current = target.scrollLeft;
    updateTimeRange();
  };

  const onHeadClicked = (e: MouseEvent) => {
    const target = e.target as HTMLDivElement;
    const rect = target.getBoundingClientRect();
    const clickAtTime = (e.clientX - rect.x) / scale;

    if (!App.chart) return;
    App.chart.beatNum = clickAtTime;
  };

  useEffect(() => {
    const updateContainerWidth = () => {
      const containerDom = containerRef.current;
      if (!containerDom) return;

      containerWidth.current = containerDom.clientWidth;
      updateTimeRange();
    };

    updateContainerWidth();
    window.addEventListener('resize', updateContainerWidth);
    return (() => {
      window.removeEventListener('resize', updateContainerWidth);
    });
  }, [scale, updateTimeRange]);

  return <div
    className="timeline-content-container"
    style={setCSSProperties({
      '--base-scale': scale,
    })}
    onScroll={(e) => onContainerScrolled(e.nativeEvent)}
    ref={containerRef}
  >
    <TimelineList
      className='timeline-content'
      style={setCSSProperties({
        '--time-length': timeLength,
      })}
    >
      <TimelineListItem
        className='timeline-right-panel-head'
        height={'40px'}
        onClick={(e) => onHeadClicked(e.nativeEvent)}
      >
        <div className="timeline-scale-container">
          {new Array(Math.floor(timeRange[1] - timeRange[0])).fill(0).map((_, index) => {
            return <BeatScale time={timeRange[0] + index} tempo={tempo} key={index} />;
          })}
        </div>
      </TimelineListItem>
      {lines.map((line, index) => { // TODO: Render keyframes
        return <KeyframesRow
          line={line}
          isExpanded={expandedLines.includes(index)}
          scale={scale}
          tempo={tempo}
          timeRange={timeRange}
          key={index}
        />;
      })}
    </TimelineList>
    <TimelineSeeker
      currentTime={useClockTime().beat}
      timeLength={timeLength}
      scale={scale}
      onSeek={(e) => {
        if (!App.chart) return;
        App.chart.beatNum = e;
      }}
    />
  </div>
};

export default React.memo(TimelineRightPanel);
