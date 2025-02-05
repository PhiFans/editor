import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useCallback } from 'react';
import TimelineList from '../List/List';
import TimelineListItem from '../List/Item';
import { useSelectedItem } from '@/ui/contexts/SelectedItem';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import ChartJudgeline from '@/Chart/Judgeline';

export type TimelineLeftPanelLineProps = {
  line: ChartJudgeline,
  name: string,
  isExpanded: boolean,
  onExpandClick: (isExpanded: boolean) => void
};

const TimelineLeftPanelLine: React.FC<TimelineLeftPanelLineProps> = ({
  line,
  name,
  isExpanded,
  onExpandClick
}: TimelineLeftPanelLineProps) => {
  const [ , setSelectedItem ] = useSelectedItem()!;

  const handleLineClicked = useCallback(() => {
    setSelectedItem((oldItem) => {
      if (oldItem === null) return { line, keyframe: null, note: null };
      else return { ...oldItem, line };
    });
  }, [line, setSelectedItem]);

  return <TimelineListItem className="line-detail" onClick={handleLineClicked}>
    <div className="line-info">
      <button className="line-expand-button" onClick={() => onExpandClick(!isExpanded)}>
        <FontAwesomeIcon icon={isExpanded ? faChevronUp : faChevronDown} />
      </button>
      <div className="line-name">{name}</div>
    </div>
    {isExpanded && <TimelineList className="line-props-expanded" style={{ height: 149.4 }}>
      <TimelineListItem className="line-prop">Speed</TimelineListItem>
      <TimelineListItem className="line-prop">Position X</TimelineListItem>
      <TimelineListItem className="line-prop">Position Y</TimelineListItem>
      <TimelineListItem className="line-prop">Rotate</TimelineListItem>
      <TimelineListItem className="line-prop">Alpha</TimelineListItem>
    </TimelineList>}
  </TimelineListItem>
};

export default TimelineLeftPanelLine;
