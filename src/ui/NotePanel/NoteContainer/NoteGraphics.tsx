/* eslint-disable react/no-unknown-property */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { extend } from '@pixi/react';
import { Container, EventMode, Sprite, Texture } from 'pixi.js';
import { useClockTime } from '@/ui/contexts/Clock';
import ChartJudgeline from '@/Chart/Judgeline';
import { NoteType } from '@/Chart/types';
import { useSelectedItem } from '@/ui/contexts/SelectedItem';
import useDrag from '@/ui/hooks/useDrag';
import { useTempo } from '@/ui/contexts/Tempo';
import { useProps } from '../PropsContext';
import ChartNote from '@/Chart/Note';
import { BeatArray, Point } from '@/utils/types';
import { BeatNumberToArray, GridValue } from '@/utils/math';

const NOTE_SCALE = 5000;

const getNoteTexture = (type: NoteType) => {
  if (type === NoteType.DRAG) return 'note-drag';
  else if (type === NoteType.FLICK) return 'note-flick';
  else return 'note-tap';
};

type NoteProps = {
  note: ChartNote,
  type: NoteType,
  beat: number,
  positionX: number,
  holdLength: number,
  width: number,
  scale: number,
  noteScale: number,
  onChanged: (id: string, time: BeatArray, timeEnd: BeatArray, positionX: number) => void,
  onSelected: (id: string) => void,
  onRightClicked: (id: string) => void,
};

const Note = React.memo(function Note ({
  note,
  type,
  beat,
  positionX,
  holdLength,
  width,
  scale,
  noteScale,
  onChanged,
  onSelected,
  onRightClicked,
}: NoteProps) {
  extend({ Container, Sprite });

  const widthHalf = useMemo(() => width / 2, [width]);
  const tempo = useTempo();
  const { align, writeMode } = useProps();
  const tempoGrid = useMemo(() => 1 / tempo, [tempo]);
  const beatGrid = useMemo(() => tempoGrid * scale, [tempoGrid, scale]);
  const alignPercent = useMemo(() => 1 / align, [align]);
  const alignGrid = useMemo(() => width * alignPercent, [width, alignPercent]);
  const [isDragging, setIsDragging] = useState(false);
  const [ time, setTime ] = useState(beat);
  const [ posX, setPosX ] = useState(positionX);
  const notePosX = (posX / 100) * widthHalf + widthHalf;
  const notePosY = time * -scale;
  const noteLength = holdLength * scale / noteScale;

  const calculateNewTime = useCallback((y: number) => {
    return GridValue(beat - (y / beatGrid / tempo), tempoGrid);
  }, [beat, beatGrid, tempo, tempoGrid]);

  const calculateNewPositionX = useCallback((x: number) => {
    const newValue = GridValue((100 + positionX + (x / widthHalf * 100)) / 2, alignPercent * 100);
    return (newValue - 50) * 2;
  }, [positionX, widthHalf, alignPercent]);

  const handleDragging = useCallback(({ x, y }: Point) => {
    setTime(calculateNewTime(y));
    setPosX(calculateNewPositionX(x));
    setIsDragging(true);
  }, [calculateNewPositionX, calculateNewTime]);

  const handleDragEnd = useCallback(({ x, y }: Point) => {
    const newTime = calculateNewTime(y);
    const newPosX = calculateNewPositionX(x);
    const newHoldEnd = note.holdEndBeatNum + (newTime - beat);

    setTime(newTime);
    setPosX(newPosX);
    setIsDragging(false);
    onChanged(note.id, BeatNumberToArray(newTime, tempo), BeatNumberToArray(newHoldEnd, tempo), newPosX);
  }, [note.holdEndBeatNum, beat, note.id, onChanged, tempo, calculateNewTime, calculateNewPositionX]);

  const handleClicked = useCallback(() => {
    onSelected(note.id);
  }, [onSelected, note.id]);

  const handleRightClicked = useCallback(() => {
    onRightClicked(note.id);
  }, [note.id, onRightClicked]);

  const { onMouseDown } = useDrag({
    grid: {
      x: alignGrid,
      y: beatGrid,
    },
    onDrag: handleDragging,
    onDragEnd: handleDragEnd,
    onClick: handleClicked,
  });

  useEffect(() => {
    setTime(beat);
    setPosX(positionX);
  }, [beat, positionX]);

  const noteEventProps = {
    x: notePosX,
    y: notePosY,
    alpha: isDragging ? 0.6 : 1,
    scale: noteScale,
    eventMode: 'static' as EventMode,
    onMouseDown: writeMode === null ? onMouseDown : null,
    onRightDown: handleRightClicked,
    cursor: 'pointer',
  };

  return (<>
    {type !== NoteType.HOLD ? (
      <pixiSprite
        texture={Texture.from(getNoteTexture(type))}
        anchor={0.5}
        {...noteEventProps}
      />
    ): (
      <pixiContainer {...noteEventProps}>
        <pixiSprite
          texture={Texture.from('note-hold-head')}
          x={0} y={0}
          anchor={{ x: 0.5, y: 0 }}
        />
        <pixiSprite
          texture={Texture.from('note-hold-body')}
          x={0} y={0}
          height={noteLength}
          anchor={{ x: 0.5, y: 1 }}
        />
        <pixiSprite
          texture={Texture.from('note-hold-end')}
          x={0} y={-noteLength}
          anchor={{ x: 0.5, y: 1 }}
        />
      </pixiContainer>
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
  extend({ Container });

  const [ notes, setNotes ] = useState<ChartNote[]>([ ...line.notes ]);
  const [ , setSelectedItem ] = useSelectedItem()!;

  const noteScale = width / NOTE_SCALE;
  const currentTime = useClockTime().beat - timeOffset;
  const timeRange = timeRangeEnd + currentTime;

  const handleNoteChanged = useCallback((id: string, time: BeatArray, timeEnd: BeatArray, positionX: number) => {
    line.editNote(
      id,
      {
        beat: time,
        positionX,
        holdEndBeat: timeEnd,
      }
    );
  }, [line]);

  const handleNoteSelected = useCallback((id: string) => {
    setSelectedItem({
      line,
      note: {
        id,
      },
      keyframe: null,
    });
  }, [line, setSelectedItem]);

  const updateNote = useCallback((notes: ChartNote[]) => {
    setNotes(notes);
  }, []);

  const handleNoteDeleted = useCallback((id: string) => {
    setSelectedItem((oldItem) => {
      if (oldItem !== null) return { ...oldItem, note: null };
      else return null;
    })
    line.deleteNote(id);
  }, [line, setSelectedItem]);

  useEffect(() => {
    line.events.on('notes.updated', updateNote);
    return (() => {
      line.events.off('notes.updated', updateNote);
    });
  }, [line, updateNote]);

  const noteSprites = (() => {
    const result = [];

    for (const note of notes) {
      if (note.holdEndBeatNum < currentTime) continue;
      if (note.beatNum > timeRange) break;

      result.push(
        <Note
          note={note}
          type={note.type}
          beat={note.beatNum}
          positionX={note.positionX}
          holdLength={note.holdLengthBeatNum}
          width={width}
          scale={scale}
          noteScale={noteScale}
          onChanged={handleNoteChanged}
          onSelected={handleNoteSelected}
          onRightClicked={handleNoteDeleted}
          key={note.id}
        />
      );
    }

    return result;
  })();

  return (
    <pixiContainer zIndex={4} y={currentTime * scale}>
      {noteSprites}
    </pixiContainer>
  );
};

export default React.memo(NoteGraphics);
