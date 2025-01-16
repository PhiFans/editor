import { useCallback, useEffect, useRef, useState } from "react";
import RangeContext from "./RangeContent";
import { Nullable } from "@/utils/types";
import { parseDoublePrecist } from "@/utils/math";
import GridBeatScale from "./BeatScale";
import GridAlignScale from "./AlignScale";

type NoteGridProps = {
  scale: number,
  alignCount: number,
};

const NoteGrid = ({
  scale,
  alignCount
}: NoteGridProps) => {
  const [ timeRange, setTimeRange ] = useState<[number, number]>([0, 0]);
  const containerRef = useRef<Nullable<HTMLDivElement>>(null);
  const containerHeight = useRef(0);

  const updateTimeRange = useCallback(() => {
    const end = parseDoublePrecist(containerHeight.current / scale, 6, 1);
    setTimeRange([ 0, end ]);
  }, [scale]);

  const updateContainerWidth = useCallback(() => {
    const containerDom = containerRef.current;
    if (!containerDom) return;

    containerHeight.current = containerDom.clientHeight;
    updateTimeRange();
  }, [updateTimeRange]);

  useEffect(() => {
    updateContainerWidth();
    window.addEventListener('resize', updateContainerWidth);
    return (() => {
      window.removeEventListener('resize', updateContainerWidth);
    });
  }, [updateContainerWidth]);

  return (
    <div
      className="note-grid-container"
      style={{
        '--scale': scale,
      } as React.CSSProperties}
      ref={containerRef}
    >
      <RangeContext.Provider value={timeRange}>
        <GridBeatScale />
        <GridAlignScale grid={alignCount} />
        <div className="note-grid"></div>
      </RangeContext.Provider>
    </div>
  );
};

export default NoteGrid;
