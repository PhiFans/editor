import React from "react";
import TimelineList from "../List/List";
import ChartJudgeline from "@/Chart/Judgeline";
import LeftPanelHead from "./Head";
import LeftPanelLine from './Line';
import './styles.css';

export type TimelineLeftPanelProps = {
  lines: ChartJudgeline[],
  expandedLines: number[],
  listScrolled: number,
  onLineExpanded: (lineIndex: number, isExpanded: boolean) => void,
};

const TimelineLeftPanel: React.FC<TimelineLeftPanelProps> = ({
  lines,
  expandedLines,
  listScrolled,
  onLineExpanded,
}) => {
  return (
    <div className="timeline-panel-left">
      <LeftPanelHead />
      <div
        className="scroller-container"
        style={{
          height: 'calc(100% - 40px)'
        }}
      >
        <TimelineList
          style={{
            position: 'relative',
            top: -listScrolled
          }}
        >
          {lines.map((line, index) => { // TODO: Render line props & add right click menu
            return <LeftPanelLine
              line={line}
              name={`Line #${index}`}
              isExpanded={expandedLines.includes(index)}
              onExpandClick={(e) => onLineExpanded(index, e)}
              key={line.id}
            />
          })}
        </TimelineList>
      </div>
    </div>
  );
};

export default TimelineLeftPanel;
