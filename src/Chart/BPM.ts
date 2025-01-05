import { BeatArray } from '@/utils/types';

export default class ChartBPM {
  beat: BeatArray;
  bpm: number;

  time: number ;
  timePerBeat: number;
  endBeat: BeatArray;
  endTime: number;


  constructor(beat: BeatArray, bpm: number) {
    this.beat = beat;
    this.bpm = bpm;

    // TODO: Auto-generating these
    this.time = NaN;
    this.timePerBeat = 60 / this.bpm;
    this.endBeat = [ Infinity, 0, 1 ];
    this.endTime = Infinity;
  }
}
