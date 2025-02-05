import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useCallback } from 'react';
import TimelineList from '../List/List';
import TimelineListItem from '../List/Item';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { selectLine } from "@/ui/store/slices/chart";
import { useAppDispatch } from '@/ui/store/hooks';

export type TimelineLeftPanelLineProps = {
  lineID: string,
  name: string,
  isExpanded: boolean,
  onExpandClick: (isExpanded: boolean) => void
};

const TimelineLeftPanelLine: React.FC<TimelineLeftPanelLineProps> = ({
  lineID,
  name,
  isExpanded,
  onExpandClick
}: TimelineLeftPanelLineProps) => {
  const dispatch = useAppDispatch();

  const handleLineClicked = useCallback(() => {
    dispatch(selectLine(lineID));
  }, [dispatch, lineID]);

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
