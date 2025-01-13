import React from "react";
import { setCSSProperties } from "@/utils/ui";
import { parseDoublePrecist } from "@/utils/math";

const ValidTempo = [
  1,
  2, 4, 8, 16,
  3, 6, 12
];

const getScaleColor = (tempo: number, index: number) => {
  const beat = index % tempo;
  for (const validTempo of ValidTempo) {
    if ((beat * validTempo) % tempo === 0) return switchScaleColor(validTempo);
  }
  return 'red';
};

const switchScaleColor = (beat: number) => {
  switch (beat) {
    case 1:
      return '';
    case 2:
      return 'red';
    case 4:
      return 'blue';
    case 8:
      return 'yellow';
    case 16:
      return 'purple-dark';
    case 3:
      return 'purple';
    case 6:
      return 'yellow-dark';
    case 12:
      return 'brown';
    default:
      return 'red';
  }
};

export type BeatScaleProps = {
  time: number,
  tempo: number,
};

const BeatScale: React.FC<BeatScaleProps> = ({
  time,
  tempo,
}) => {
  const beatSubscale = parseDoublePrecist(1 / tempo, 6, -1);

  return <>
    <div className='timeline-scale' style={setCSSProperties({ '--time': time })} />
    {new Array(tempo - 1).fill(0).map((_, index) => {
      const currentBeat = (time + (index + 1) * beatSubscale);
      return <div
        className={`timeline-scale ${getScaleColor(tempo, index + 1)}`}
        style={setCSSProperties({ '--time': currentBeat })}
        key={currentBeat}
      />
    })}
  </>
};

export default React.memo(BeatScale);
