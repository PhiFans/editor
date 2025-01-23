import { v4 as uuid } from 'uuid';
import { BeatArrayToNumber, parseDoublePrecist } from '@/utils/math';
import { BeatArray } from '@/utils/types';

export default class ChartBPM {
  /** Internal property */
  readonly id: string;

  beat: BeatArray;
  beatNum: number;
  bpm: number;

  time: number ;
  timePerBeat: number;
  endBeat: BeatArray;
  endBeatNum: number;
  endTime: number;

  constructor(beat: BeatArray, bpm: number, id = uuid()) {
    if (BeatArrayToNumber(beat) < 0) throw new Error('Cannot set a negative beat to BPM!');
    if (bpm <= 0) throw new Error('Cannot set a zero/negative BPM!');

    this.id = id;
    this.beat = beat;
    this.beatNum = BeatArrayToNumber(this.beat);
    this.bpm = bpm;

    /**
     * NOTE: These will be generated by BPMList automatically,
     * please do not edit them manually!
    */
    this.time = NaN;
    this.timePerBeat = parseDoublePrecist(60 / this.bpm, 6, -1);
    this.endBeat = [ Infinity, 0, 1 ];
    this.endBeatNum = Infinity;
    this.endTime = Infinity;
  }

  update() {
    this.beatNum = BeatArrayToNumber(this.beat);
    this.timePerBeat = parseDoublePrecist(60 / this.bpm, 6, -1);
  }
}
