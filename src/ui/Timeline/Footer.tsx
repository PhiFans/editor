import React from 'react';

export type TimelineFooterProps = {
  leftContent?: JSX.Element[];
  rightContent?: JSX.Element[];
};

const TimelineFooter: React.FC<TimelineFooterProps> = ({
  leftContent,
  rightContent
}: TimelineFooterProps) => {
  return <div className="timeline-footer">
    <div className='timeline-footer-left'>
      {leftContent || null}
    </div>
    <div className='timeline-footer-right'>
      {rightContent || null}
    </div>
  </div>
};

export default TimelineFooter;
