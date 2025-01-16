import { useTempo } from "../contexts/Tempo";
import { useRange } from "./RangeContent";
import { parseDoublePrecist } from "@/utils/math";
import { getScaleColor } from "@/utils/tempo";

type BeatScaleProps = {
  time: number,
};

const BeatScale = ({
  time,
}: BeatScaleProps) => {
  const tempo = useTempo();
  const beatSubscale = parseDoublePrecist(1 / tempo, 6, -1);

  return (
    <>
      <div
        className="note-grid-beat-scale"
        style={{ '--time': time } as React.CSSProperties}
      />
      {new Array(tempo - 1).fill(0).map((_, index) => {
        return <div
          className={`note-grid-beat-scale ${getScaleColor(tempo, index + 1)}`}
          style={{ '--time': (time + (index + 1) * beatSubscale) } as React.CSSProperties}
          key={index}
        />
      })}
    </>
  );
}

const GridBeatScale = () => {
  const timeRange = useRange();
  const timeRangeStart = Math.floor(timeRange[0])
  const timeRangeLength = Math.ceil(timeRange[1]) - timeRangeStart;


  return (
    <div className="note-grid-scale note-grid-beat-scale-container">
      {new Array(timeRangeLength).fill(0).map((_, index) => {
        return <BeatScale time={timeRangeStart + index} key={timeRangeStart + index} />
      })}
    </div>
  )
};

export default GridBeatScale;
