import React from 'react';
import { setCSSProperties } from '@/utils/ui';

export type TimelineListItemProps = {
  height?: number | string,
  className?: string,
  style?: React.CSSProperties,
  children?: React.ReactNode,
};

const TimelineListItem: React.FC<TimelineListItemProps> = ({
  height,
  className,
  style,
  children
}: TimelineListItemProps) => {
  let styles: React.CSSProperties = {};
  if (style) styles = { ...style };
  if (height) styles = { ...styles, ...setCSSProperties({ '--height': `${height}` }) };

  return <div
    className={`timeline-list-item ${className ? className : ''}`}
    style={styles}
  >{children}</div>
};

export default React.memo(TimelineListItem);
