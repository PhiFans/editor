import React from "react";
import TimelineList from "../List/List";
import ChartJudgeline from "@/Chart/Judgeline";
import LeftPanelHead from "./Head";
import LeftPanelLine from './Line';
import './styles.css';

export type TimelineLeftPanelProps = {
  lines: ChartJudgeline[],
  expandedLines: number[],
  onLineExpanded: (lineIndex: number, isExpanded: boolean) => void,
};

const TimelineLeftPanel: React.FC<TimelineLeftPanelProps> = ({
  lines,
  expandedLines,
  onLineExpanded,
}) => {
  return (
    <div className="timeline-panel-left">
      <LeftPanelHead />
      <TimelineList>
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
  );
};

export default TimelineLeftPanel;
