import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Stage, Container, Sprite } from '@pixi/react';
import { Texture } from 'pixi.js';
import ChartJudgeline from '@/Chart/Judgeline';
import TimeContextProvider from './TimeContext/Provider';
import { useTempo } from '@/ui/contexts/Tempo';
import useTimeRange from './TimeRange';
import BeatGraphics from './BeatGraphics';
import NoteGraphics from './NoteGraphics';
import { Nullable } from '@/utils/types';

const NOTE_OFFSET = 50;

type NoteContainerProps = {
  line: Nullable<ChartJudgeline>,
  scale: number,
};

const NoteContainer = ({
  line,
  scale
}: NoteContainerProps) => {
  const timeOffset = useCallback(() => {
    return NOTE_OFFSET / scale;
  }, [scale])();

  const tempo = useTempo();
  const containerRef = useRef<Nullable<HTMLDivElement>>(null);
  const timeRangeEnd = useTimeRange({ ref: containerRef, scale });
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
        raf={false}
        renderOnComponentChange={true}
        options={{
          backgroundAlpha: 0,
        }}
      >
        <TimeContextProvider>
          <Container y={size[1]}>
            <BeatGraphics
              timeRangeEnd={timeRangeEnd}
              scale={scale}
              tempo={tempo}
              width={size[0]}
              timeOffset={timeOffset}
            />
            <Sprite
              texture={Texture.WHITE}
              width={size[0]}
              height={4}
              x={0}
              y={-NOTE_OFFSET}
              anchor={{ x: 0, y: 0.5 }}
              tint={0x00ff00}
              zIndex={2}
            />
            {line && (
              <NoteGraphics
              timeRangeEnd={timeRangeEnd}
                scale={scale}
                width={size[0]}
                line={line}
                timeOffset={timeOffset}
              />
            )}
          </Container>
        </TimeContextProvider>
      </Stage>
    </div>
  );
};

export default React.memo(NoteContainer);
