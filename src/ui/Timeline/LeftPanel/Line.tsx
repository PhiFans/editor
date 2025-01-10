import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ChartJudgeline from '@/Chart/Judgeline';
import TimelineList from '../List/List';
import TimelineListItem from '../List/Item';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

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
  return <TimelineListItem className="line-detail">
    <div className="line-info">
      <button className="line-expand-button" onClick={() => onExpandClick(!isExpanded)}>
        <FontAwesomeIcon icon={isExpanded ? faChevronUp : faChevronDown} />
      </button>
      <div className="line-name">{name}</div>
    </div>
    {isExpanded && <TimelineList className="line-props-expanded">
      <TimelineListItem className="line-prop">Speed</TimelineListItem>
      <TimelineListItem className="line-prop">Position X</TimelineListItem>
      <TimelineListItem className="line-prop">Position Y</TimelineListItem>
      <TimelineListItem className="line-prop">Rotate</TimelineListItem>
      <TimelineListItem className="line-prop">Alpha</TimelineListItem>
    </TimelineList>}
  </TimelineListItem>
};

export default TimelineLeftPanelLine;
