import { useCallback, useEffect, useState } from "react";
import { Nullable } from "@/utils/types";
import { parseDoublePrecist } from "@/utils/math";

type TimeRange = [ number, number ];

type TimeRangeProps = {
  ref: React.RefObject<Nullable<HTMLElement>>,
  scale: number,
  currentTime?: number,
};

const useTimeRange = ({
  ref,
  scale,
  currentTime = 0
}: TimeRangeProps): { range: TimeRange } => {
  const [ range, setRange ] = useState<TimeRange>([ 0, 0 ]);

  const updateRange = useCallback(() => {
    const dom = ref.current;
    if (!dom) return;

    setRange([
      0 + currentTime,
      parseDoublePrecist(dom.clientHeight / scale, 6, -1) + currentTime
    ])
  }, [currentTime, ref, scale]);

  useEffect(() => {
    updateRange();
    window.addEventListener('resize', updateRange);
    return (() => {
      window.removeEventListener('resize', updateRange);
    });
  }, [updateRange]);

  return {
    range
  };
};

export default useTimeRange;
