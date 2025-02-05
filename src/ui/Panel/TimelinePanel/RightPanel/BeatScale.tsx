import React from "react";
import { useTempo } from "@/ui/contexts/Tempo";
import { parseDoublePrecist } from "@/utils/math";
import { getScaleColor } from "@/utils/tempo";

export type BeatScaleProps = {
  time: number,
};

const BeatScale: React.FC<BeatScaleProps> = ({
  time,
}) => {
  const tempo = useTempo();
  const beatSubscale = parseDoublePrecist(1 / tempo, 6, -1);

  return <>
    <div className='timeline-scale' style={{ '--time': time } as React.CSSProperties} />
    {new Array(tempo - 1).fill(0).map((_, index) => {
      return <div
        className={`timeline-scale ${getScaleColor(tempo, index + 1)}`}
        style={{ '--time': (time + (index + 1) * beatSubscale) } as React.CSSProperties}
        key={index}
      />
    })}
  </>
};

export default React.memo(BeatScale);
