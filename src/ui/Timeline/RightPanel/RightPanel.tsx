import React, { useCallback, useMemo, useState } from 'react';
import App from '@/App/App';
import ChartJudgeline from "@/Chart/Judgeline";
import TimelineList from "../List/List";
import TimelineListItem from '../List/Item';
import TimelineSeeker from '../Seeker';
import Keyframes from './Keyframes';
import ChartJudgelineProps from '@/Chart/JudgelineProps';
import './styles.css';
import RangeContainer from './RangeContainer';
import RightPanelHead from './Head';

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
  const [ timeRange, setTimeRange ] = useState<[number, number]>([ 0, 0 ]);

  const handleRangeChanged = useCallback((newRange: [number, number]) => {
    setTimeRange(newRange);
  }, []);

  const onSeeked = useCallback((time: number) => {
    if (!App.chart) return;
    App.chart.beatNum = time;
  }, []);

  const onHeadClicked = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const target = e.target as HTMLDivElement;
    const rect = target.getBoundingClientRect();
    const clickAtTime = (e.clientX - rect.x) / scale;

    onSeeked(clickAtTime);
  }, [onSeeked, scale]);

  const keyframeRowMemoed = useMemo(() => {
    return lines.map((line, index) => { // TODO: Render keyframes
      return <KeyframesRow
        line={line}
        isExpanded={expandedLines.includes(index)}
        scale={scale}
        tempo={tempo}
        timeRange={timeRange}
        key={index}
      />;
    });
  }, [lines, expandedLines, scale, tempo, timeRange]);

  return (
    <RangeContainer
      scale={scale}
      onRangeChanged={handleRangeChanged}
    >
      <RightPanelHead
        timeRange={timeRange}
        tempo={tempo}
        onClick={onHeadClicked}
      />
      <TimelineList
        className='timeline-content'
        style={{
          '--time-length': timeLength,
        } as React.CSSProperties}
      >
        {keyframeRowMemoed}
      </TimelineList>
      <TimelineSeeker
        timeLength={timeLength}
        scale={scale}
        onSeek={onSeeked}
      />
    </RangeContainer>
  )
};

export default TimelineRightPanel;
