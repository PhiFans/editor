import { useCallback, useEffect, useRef, useState } from 'react';
import { Stage, Container, Sprite } from '@pixi/react';
import { Texture } from 'pixi.js';
import ChartJudgeline from '@/Chart/Judgeline';
import useTimeRange from './TimeRange';
import BeatGraphics from './BeatGraphics';
import { Nullable } from '@/utils/types';
import { useTempo } from '@/ui/contexts/Tempo';
import { useClockTime } from '@/ui/contexts/Clock';
import NoteGraphics from './NoteGraphics';

const NOTE_OFFSET = 50;

type NoteContainerProps = {
  line: Nullable<ChartJudgeline>,
  scale: number,
};

const NoteContainer = ({
  line,
  scale
}: NoteContainerProps) => {
  const timeOffset = NOTE_OFFSET / scale;
  const currentTime = useClockTime().beat;
  const tempo = useTempo();
  const containerRef = useRef<Nullable<HTMLDivElement>>(null);
  const { range: timeRange } = useTimeRange({ ref: containerRef, scale, currentTime, timeOffset });
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
        <Sprite
          texture={Texture.WHITE}
          width={size[0]}
          height={4}
          x={0}
          y={size[1] - NOTE_OFFSET}
          tint={0x00ff00}
        />
        <Container y={size[1] + (currentTime * scale) - NOTE_OFFSET}>
          <BeatGraphics
            timeRange={timeRange}
            scale={scale}
            tempo={tempo}
            width={size[0]}
          />
          {line && (
            <NoteGraphics
              timeRange={timeRange}
              scale={scale}
              width={size[0]}
              line={line}
            />
          )}
        </Container>
      </Stage>
    </div>
  );
};

export default NoteContainer;
