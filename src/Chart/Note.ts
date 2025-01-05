import ChartJudgeline from './Judgeline';
import { NoteType } from './types';
import { BeatArray } from '@/utils/types';

export default class ChartNote {
  line: ChartJudgeline;
  type: NoteType;
  beat: BeatArray;
  positionX: number;
  speed: number;

  holdEndBeat: BeatArray;

  time: number;
  holdEndTime: number;
  floorPosition: number;

  constructor(
    line: ChartJudgeline,
    type: NoteType,
    beat: BeatArray,
    positionX: number,
    speed: number,

    holdEndBeat?: BeatArray
  ) {
    this.line = line;
    this.type = type;
    this.beat = beat;
    this.positionX = positionX;
    this.speed = speed;

    this.holdEndBeat = this.type === NoteType.HOLD && holdEndBeat ? holdEndBeat : [ NaN, 0, 1 ];

    // TODO: Auto-generating these
    this.time = 0;
    this.holdEndTime = this.type === NoteType.HOLD ? 0 : NaN;
    this.floorPosition = 0;
  }
}
