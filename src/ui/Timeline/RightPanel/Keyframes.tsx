import TimelineListItem from '../List/Item';

export type TimelineRightPanelKeyframesProps = {
  isExpanded: boolean;
}

const TimelineRightPanelKeyframes: React.FC<TimelineRightPanelKeyframesProps> = ({
  isExpanded,
}: TimelineRightPanelKeyframesProps) => {
  return <>
    <TimelineListItem />
    {isExpanded && <>
      <TimelineListItem />
      <TimelineListItem />
      <TimelineListItem />
      <TimelineListItem />
      <TimelineListItem />
    </>}
  </>
};

export default TimelineRightPanelKeyframes;
