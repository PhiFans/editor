import React from 'react';
import { Container, Sprite } from '@pixi/react';
import { Texture } from 'pixi.js';
import { useTime } from './TimeContext';
import ChartJudgeline from '@/Chart/Judgeline';
import { NoteType } from '@/Chart/types';

const NOTE_SCALE = 5000;

const getNoteTexture = (type: NoteType) => {
  if (type === NoteType.DRAG) return 'note-drag';
  else if (type === NoteType.FLICK) return 'note-flick';
  else return 'note-tap';
};

type NoteProps = {
  type: NoteType,
  x: number,
  y: number,
  scale: number,
  length?: number
};

const Note = React.memo(function Note ({
  type,
  x, y,
  scale,
  length = 0,
}: NoteProps) {
  return (<>
    {type !== NoteType.HOLD ? (
      <Sprite
        texture={Texture.from(getNoteTexture(type))}
        x={x} y={-y}
        anchor={0.5} scale={scale}
      />
    ): (
      <Container x={x} y={-y} scale={scale}>
        <Sprite
          texture={Texture.from('note-hold-head')}
          x={0} y={0}
          anchor={{ x: 0.5, y: 0 }}
        />
        <Sprite
          texture={Texture.from('note-hold-body')}
          x={0} y={0}
          height={length / scale}
          anchor={{ x: 0.5, y: 1 }}
        />
        <Sprite
          texture={Texture.from('note-hold-end')}
          x={0} y={-length / scale}
          anchor={{ x: 0.5, y: 1 }}
        />
      </Container>
    )}
  </>);
});

type NoteGraphicsProps = {
  timeRangeEnd: number,
  scale: number,
  width: number,
  line: ChartJudgeline,
  timeOffset?: number,
};

const NoteGraphics = ({
  timeRangeEnd,
  scale,
  width,
  line,
  timeOffset = 0
}: NoteGraphicsProps) => {
  const widthHalf = width / 2;
  const noteScale = width / NOTE_SCALE;

  const currentTime = useTime() - timeOffset;
  const timeRange = timeRangeEnd + timeOffset;

  const noteSprites = (() => {
    const result = [];

    for (const note of line.notes) {
      if (note.holdEndBeatNum < currentTime) continue;
      if (note.beatNum > timeRange) break;

      result.push(
        <Note
          type={note.type}
          x={note.positionX * widthHalf + widthHalf}
          y={note.beatNum * scale}
          scale={noteScale}
          length={note.holdLengthBeatNum * scale}
          key={note.id}
        />
      );
    }

    return result;
  })();
  return (
    <Container zIndex={3} y={currentTime * scale}>
      {noteSprites}
    </Container>
  );
};

export default React.memo(NoteGraphics);
