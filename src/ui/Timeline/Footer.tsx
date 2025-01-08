import React from 'react';

export type TimelineFooterProps = {
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
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
