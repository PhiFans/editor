import React from "react";
import TimelineList from "../List/List";
import LeftPanelHead from "./Head";
import LeftPanelLine from './Line';
import './styles.css';
import { useAppSelector } from "@/ui/store/hooks";
import { selectAllLinesState } from "@/ui/store/selectors/chart";

export type TimelineLeftPanelProps = {
  expandedLines: number[],
  onLineExpanded: (lineIndex: number, isExpanded: boolean) => void,
};

const TimelineLeftPanel: React.FC<TimelineLeftPanelProps> = ({
  expandedLines,
  onLineExpanded,
}) => {
  const lines = useAppSelector((state) => selectAllLinesState(state));

  return (
    <div className="timeline-panel-left">
      <LeftPanelHead />
      <TimelineList>
        {lines.map((line, index) => { // TODO: Render line props & add right click menu
          return <LeftPanelLine
            lineID={line.id}
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
