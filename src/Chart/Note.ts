import { v4 as uuid } from 'uuid';
import ChartJudgeline from './Judgeline';
import { BeatArrayToNumber } from '@/utils/math';
import { NoteType } from './types';
import { BeatArray } from '@/utils/types';

export type ChartNoteProps = {
  line: ChartJudgeline,
  type: NoteType,
  beat: BeatArray,
  positionX: number,
  speed: number,
  isAbove: boolean,

  holdEndBeat?: BeatArray
};

export default class ChartNote {
  /** Internal property */
  readonly id: string;

  line: ChartJudgeline;
  type: NoteType;
  beat: BeatArray;
  positionX: number;
  speed: number;
  isAbove: boolean;

  holdEndBeat: BeatArray;

  beatNum: number;
  time: number;
  holdEndBeatNum: number;
  holdEndTime: number;
  holdLengthBeatNum: number;
  holdLengthTime: number;
  floorPosition: number;

  constructor({
    line,
    type,
    beat,
    positionX,
    speed,
    isAbove,

    holdEndBeat
  }: ChartNoteProps, id = uuid()) {
    this.id = id;

    this.line = line;
    this.type = type;
    this.beat = beat;
    this.positionX = positionX;
    this.speed = speed;
    this.isAbove = isAbove;

    this.holdEndBeat = this.type === NoteType.HOLD && holdEndBeat ? holdEndBeat : this.beat;

    // TODO: Auto-generating these
    this.beatNum = BeatArrayToNumber(this.beat);
    this.time = 0;
    this.holdEndBeatNum = this.type === NoteType.HOLD ? BeatArrayToNumber(this.holdEndBeat) : this.beatNum;
    this.holdEndTime = this.type === NoteType.HOLD ? 0 : this.time;
    this.holdLengthBeatNum = this.type === NoteType.HOLD ? this.holdEndBeatNum - this.beatNum : 0;
    this.holdLengthTime = this.type === NoteType.HOLD ? 0 : 0;
    this.floorPosition = 0;
  }
}
