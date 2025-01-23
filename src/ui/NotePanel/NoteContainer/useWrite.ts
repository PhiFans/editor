import { useCallback, useMemo, useRef } from 'react';
import { v4 as uuid } from 'uuid';
import App from '@/App/App';
import { useProps } from '../PropsContext';
import { useTempo } from '@/ui/contexts/Tempo';
import { BeatArrayToNumber, BeatNumberToArray, GridValue, parseDoublePrecist } from '@/utils/math';
import { Point as PixiPoint } from 'pixi.js';
import { Point } from '@/utils/types';
import { ChartNoteProps } from '@/Chart/Note';
import { NoteType } from '@/Chart/types';
import { BeatArray, Nullable } from '@/utils/types';

type PixiPointEvent = MouseEvent & {
  screen: PixiPoint,
};

type WriteProps = {
  width: number,
  height: number,
  onAddStart: (props: Omit<ChartNoteProps, 'line'>, id: string) => void,
  onAdding: (props: { holdEndBeat: BeatArray }, id: string) => void,
  onAdded: (props: Omit<ChartNoteProps, 'line'>) => void,
  timeOffset?: number,
};

const useWrite = ({
  width,
  height,
  onAddStart,
  onAdding,
  onAdded,
  timeOffset = 0,
}: WriteProps) => {
  const tempo = useTempo();
  const { scale, align, writeMode } = useProps();
  const tempoGrid = useMemo(() => 1 / tempo, [tempo]);
  const beatGrid = useMemo(() => tempoGrid * scale, [tempoGrid, scale]);
  const alignGrid = useMemo(() => width / align, [width, align]);
  const widthHalf = useMemo(() => width / 2, [width]);

  const posDiff = useRef<Nullable<Point>>(null);
  const holdPropRef = useRef<Nullable<Omit<ChartNoteProps, 'line'>>>(null);
  const holdIDRef = useRef<Nullable<string>>(null);
  const holdLastEndRef = useRef<number>(NaN);

  const posToPositionX = useCallback((pos: number) => {
    const result = GridValue(pos, alignGrid);
    return (result - widthHalf) / widthHalf;
  }, [alignGrid, widthHalf]);

  const posToTime = useCallback((pos: number) => {
    const hitTime = GridValue(height - pos, beatGrid) / beatGrid / tempo - timeOffset;
    const gridResult = GridValue(App.chart!.beatNum + hitTime, tempoGrid);
    return parseDoublePrecist(gridResult, 6, -1);
  }, [height, timeOffset, tempoGrid, beatGrid, tempo]);

  const handleMoving = useCallback((e: MouseEvent) => {
    if (posDiff.current === null) return;
    if (holdPropRef.current === null) return;
    if (holdIDRef.current === null) return;

    const posY = e.clientY - posDiff.current.y;
    const beatNum = posToTime(posY);

    if (BeatArrayToNumber(holdPropRef.current.beat) > beatNum) return;
    if (beatNum !== holdLastEndRef.current) {
      onAdding({ holdEndBeat: BeatNumberToArray(beatNum, tempo) }, holdIDRef.current);
      holdLastEndRef.current = beatNum;
    }
  }, [onAdding, tempo, posToTime]);

  const handleMoveEnd = useCallback(() => {
    window.removeEventListener('mousemove', handleMoving);
    window.removeEventListener('mousedown', handleMoveEnd);

    posDiff.current = null;
    holdPropRef.current = null;
    holdIDRef.current = null;
  }, [handleMoving]);

  const handleClicked = useCallback((e: PixiPointEvent) => {
    if (writeMode === null) return;
    e.preventDefault();

    const { x, y } = e.screen;
    const posX = posToPositionX(x);
    const beatNum = posToTime(y);

    if (writeMode !== NoteType.HOLD) {
      onAdded({
        type: writeMode,
        beat: BeatNumberToArray(beatNum, tempo),
        positionX: posX,
        speed: 1,
        isAbove: true,
      });
    } else {
      if (holdPropRef.current === null) {
        const { clientX, clientY } = e;
        const holdID = uuid();
        const holdProps = {
          type: NoteType.HOLD,
          beat: BeatNumberToArray(beatNum, tempo),
          positionX: posX,
          speed: 1,
          isAbove: true,
          holdEndBeat: BeatNumberToArray(beatNum, tempo),
        };

        onAddStart(holdProps, holdID);

        posDiff.current = { x: clientX - x, y: clientY - y };
        holdPropRef.current = holdProps;
        holdIDRef.current = holdID;

        window.addEventListener('mousemove', handleMoving);
        window.addEventListener('mousedown', handleMoveEnd);
      }
    }
  }, [writeMode, posToPositionX, posToTime, onAdded, tempo, onAddStart, handleMoving, handleMoveEnd]);

  return {
    onClick: handleClicked,
  };
};

export default useWrite;
