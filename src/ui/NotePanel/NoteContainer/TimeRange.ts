import { useCallback, useEffect, useState } from "react";
import { parseDoublePrecist } from "@/utils/math";
import { Nullable } from "@/utils/types";

type TimeRangeProps = {
  ref: React.RefObject<Nullable<HTMLElement>>,
  scale: number,
};

const useTimeRange = ({
  ref,
  scale,
}: TimeRangeProps): number => {
  const [ range, setRange ] = useState<number>(0);

  const updateRange = useCallback(() => {
    const dom = ref.current;
    if (!dom) return;

    setRange(parseDoublePrecist(dom.clientHeight / scale, 6, -1));
  }, [ref, scale]);

  useEffect(() => {
    updateRange();
    window.addEventListener('resize', updateRange);
    return (() => {
      window.removeEventListener('resize', updateRange);
    });
  }, [updateRange]);

  return range;
};

export default useTimeRange;
