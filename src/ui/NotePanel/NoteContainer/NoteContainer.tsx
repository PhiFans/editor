import { useCallback, useEffect, useRef, useState } from 'react';
import { Stage, Container, Text } from '@pixi/react';
import ChartJudgeline from '@/Chart/Judgeline';
import useTimeRange from './TimeRange';
import BeatGraphics from './BeatGraphics';
import { Nullable } from '@/utils/types';
import { useTempo } from '@/ui/contexts/Tempo';
import { useClockTime } from '@/ui/contexts/Clock';

type NoteContainerProps = {
  line: Nullable<ChartJudgeline>,
  scale: number,
};

const NoteContainer = ({
  line,
  scale
}: NoteContainerProps) => {
  const currentTime = useClockTime().beat;
  const tempo = useTempo();
  const containerRef = useRef<Nullable<HTMLDivElement>>(null);
  const { range: timeRange } = useTimeRange({ ref: containerRef, scale, currentTime });
  const [ size, setSize ] = useState<[number, number]>([1, 1]);

  const updateSize = useCallback(() => {
    const containerDom = containerRef.current;
    if (!containerDom) return;

    setSize([
      containerDom.clientWidth,
      containerDom.clientHeight
    ]);
  }, []);

  useEffect(() => {
    updateSize();
    window.addEventListener('resize', updateSize);
    return (() => {
      window.removeEventListener('resize', updateSize);
    });
  }, [updateSize]);

  return (
    <div
      className="note-container"
      ref={containerRef}
    >
      <Stage
        width={size[0]}
        height={size[1]}
        options={{
          backgroundAlpha: 0,
        }}
      >
        <Container y={size[1] + (currentTime * scale)}>
          <Text text='hello world!' />
          <BeatGraphics
            timeRange={timeRange}
            scale={scale}
            tempo={tempo}
            width={size[0]}
          />
        </Container>
      </Stage>
    </div>
  );
};

export default NoteContainer;
