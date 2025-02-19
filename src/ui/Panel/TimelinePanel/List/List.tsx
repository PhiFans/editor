import React from 'react';
import { setCSSProperties } from '@/utils/ui';

export type TimelineListProps = {
  itemHeight?: number | string,
  className?: string,
  style?: React.CSSProperties,
  children?: React.ReactNode,
  ref?: React.Ref<HTMLDivElement>,
};

const TimelineList: React.FC<TimelineListProps> = ({
  itemHeight,
  className,
  style,
  children,
  ref,
}) => {
  let styles: React.CSSProperties = {};
  if (style) styles = { ...style };
  if (itemHeight) styles = { ...styles, ...setCSSProperties({ '--height': `${itemHeight}` }) };

  return <div
    className={`timeline-list ${className ? className : ''}`}
    style={styles}
    ref={ref}
  >{children}</div>
};

export default TimelineList;
