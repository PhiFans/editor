import React, { useCallback, useRef, useState } from 'react';
import { Application, ApplicationRef, extend } from '@pixi/react';
import { Container, Rectangle, Sprite, Texture } from 'pixi.js';
import { useSelectedItem } from '@/ui/contexts/SelectedItem';
import useResizeEffect from '@/ui/hooks/useResizeEffect';
import ChartJudgeline from '@/Chart/Judgeline';
import useTimeRange from './TimeRange';
import BeatGraphics from './BeatGraphics';
import NoteGraphics from './NoteGraphics';
import { BeatArray, Nullable } from '@/utils/types';
import { useProps } from '../PropsContext';
import useWrite from './useWrite';
import { ChartNoteProps } from '@/Chart/Note';
import useWheel from './useWheel';

const NOTE_OFFSET = 50;

type NoteContainerProps = {
  line: Nullable<ChartJudgeline>,
};

const NoteContainer = ({
  line,
}: NoteContainerProps) => {
  extend({ Container, Sprite });

  const { scale, writeMode } = useProps();
  const timeOffset = useCallback(() => {
    return NOTE_OFFSET / scale;
  }, [scale])();

  const [, setSelectedItem ] = useSelectedItem()!;
  const containerRef = useRef<Nullable<HTMLDivElement>>(null);
  const appRef = useRef<Nullable<ApplicationRef>>(null);
  const hitAreaRef = useRef<Nullable<Container>>(null);
  const timeRangeEnd = useTimeRange({ ref: containerRef, scale });
  const [ size, setSize ] = useState<[number, number]>([1, 1]);

  const updateSize = useCallback((width: number, height: number) => {
    if (!appRef.current) return;
    const app = appRef.current.getApplication();
    if (!app) return;

    app.resize();
    setSize([
      width,
      height
    ]);

    const hitArea = hitAreaRef.current;
    if (!hitArea) return;

    const hitRectangle = hitArea.hitArea as Rectangle | undefined;
    if (!hitRectangle) {
      hitArea.hitArea = new Rectangle(0, -height, width, height);
      return;
    }

    hitRectangle.y = -height;
    hitRectangle.width = width;
    hitRectangle.height = height;
  }, []);

  const handleEmptySelect = useCallback(() => {
    setSelectedItem((oldItem) => {
      if (oldItem !== null) return { ...oldItem, note: null };
      else return null;
    });
  }, [setSelectedItem]);

  const handleHoldAddStart = useCallback((props: Omit<ChartNoteProps, 'line'>, id: string) => {
    if (!line) return;
    line.addNote(props, id);
  }, [line]);

  const handleHoldAdding = useCallback((props: { holdEndBeat: BeatArray }, id: string) => {
    if (!line) return;
    line.editNote(id, props);
  }, [line]);

  const handleNewNoteAdded = useCallback((props: Omit<ChartNoteProps, 'line'>) => {
    if (!line) return;
    line.addNote(props);
  }, [line]);

  const { onWheel } = useWheel();
  const { onClick } = useWrite({
    width: size[0],
    height: size[1],
    onAddStart: handleHoldAddStart,
    onAdding: handleHoldAdding,
    onAdded: handleNewNoteAdded,
    timeOffset,
  });

  useResizeEffect(({ width, height }) => {
    updateSize(width, height);
  }, containerRef);

  return (
    <div
      className="note-container"
      onContextMenu={(e) => e.preventDefault()}
      onWheel={onWheel}
      ref={containerRef}
    >
      <Application
        backgroundAlpha={0}
        resizeTo={containerRef}
        onInit={(app) => {
          updateSize(app.canvas.width, app.canvas.height);
        }}
        ref={appRef}
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
            texture={Texture.WHITE}
            width={size[0]}
            height={4}
            x={0}
            y={-NOTE_OFFSET}
            anchor={{ x: 0, y: 0.5 }}
            tint={0x00ff00}
            zIndex={2}
          />
          <pixiContainer
            x={0} y={0}
            eventMode='static'
            onMouseDown={writeMode !== null && line ? onClick : handleEmptySelect}
            zIndex={3}
            key='note-container-hitarea'
            ref={hitAreaRef}
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
