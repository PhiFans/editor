import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Application, extend } from '@pixi/react';
import { Container, Sprite, Texture } from 'pixi.js';
import ChartJudgeline from '@/Chart/Judgeline';
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
  extend({ Container, Sprite });

  const timeOffset = useCallback(() => {
    return NOTE_OFFSET / scale;
  }, [scale])();

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
      <Application
        backgroundAlpha={0}
        resizeTo={containerRef}
      >
        <pixiContainer
          y={size[1]}
        >
          <BeatGraphics
            timeRangeEnd={timeRangeEnd}
            scale={scale}
            width={size[0]}
            timeOffset={timeOffset}
          />
          <pixiSprite
            // eslint-disable-next-line react/no-unknown-property
            texture={Texture.WHITE}
            width={size[0]}
            height={4}
            x={0}
            y={-NOTE_OFFSET}
            // eslint-disable-next-line react/no-unknown-property
            anchor={{ x: 0, y: 0.5 }}
            // eslint-disable-next-line react/no-unknown-property
            tint={0x00ff00}
            // eslint-disable-next-line react/no-unknown-property
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
        </pixiContainer>
      </Application>
    </div>
  );
};

export default React.memo(NoteContainer);
