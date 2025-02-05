import React from 'react';
import { setCSSProperties } from '@/utils/ui';

export type TimelineListItemProps = {
  height?: number | string,
  className?: string,
  style?: React.CSSProperties,
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void,
  onDoubleClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void,
  children?: React.ReactNode,
};

const TimelineListItem: React.FC<TimelineListItemProps> = ({
  height,
  className,
  style,
  onClick,
  onDoubleClick,
  children
}: TimelineListItemProps) => {
  let styles: React.CSSProperties = {};
  if (style) styles = { ...style };
  if (height) styles = { ...styles, ...setCSSProperties({ '--height': `${height}` }) };

  return <div
    className={`timeline-list-item ${className ? className : ''}`}
    style={styles}
    onClick={onClick}
    onDoubleClick={onDoubleClick}
  >{children}</div>
};

export default TimelineListItem;
