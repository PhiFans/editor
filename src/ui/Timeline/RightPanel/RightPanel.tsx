import React, { useMemo } from 'react';
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
};

const KeyframesRow: React.FC<KeyframesRowProps> = ({
  line,
  isExpanded,
  scale,
}) => {
  // TODO: Beat
  const onAddKeyframe = (type: keyof ChartJudgelineProps, beat: number) => {
    const beatRound = Math.round(beat);
    line.addKeyframe(type, [ beatRound, 0, 1 ], 1, false, 1);
  };

  return <>
    <TimelineListItem />
    {isExpanded && <>
      <Keyframes keyframes={line.props.speed} scale={scale} onAddKeyframe={((b) => onAddKeyframe('speed', b))} />
      <Keyframes keyframes={line.props.positionX} scale={scale} onAddKeyframe={((b) => onAddKeyframe('positionX', b))} />
      <Keyframes keyframes={line.props.positionY} scale={scale} onAddKeyframe={((b) => onAddKeyframe('positionY', b))} />
      <Keyframes keyframes={line.props.rotate} scale={scale} onAddKeyframe={((b) => onAddKeyframe('rotate', b))} />
      <Keyframes keyframes={line.props.alpha} scale={scale} onAddKeyframe={((b) => onAddKeyframe('alpha', b))} />
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
  const scaleMemoed = useMemo(() => {
    return new Array(Math.floor(timeLength)).fill(0).map((_, index) => {
      return <BeatScale time={index} tempo={tempo} key={index} />;
    });
  }, [tempo, timeLength]);

  const keyframesMemoed = useMemo(() => {
    return lines.map((line, index) => { // TODO: Render keyframes
      return <KeyframesRow line={line} isExpanded={expandedLines.includes(index)} scale={scale} key={index} />;
    });
  }, [lines, expandedLines, scale]);

  return <div
    className="timeline-content-container"
    style={setCSSProperties({
      '--base-scale': scale,
    })}
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
      >
        <div className="timeline-scale-container">{scaleMemoed}</div>
      </TimelineListItem>
      {keyframesMemoed}
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
