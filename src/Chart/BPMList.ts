import { BeatArrayToNumber, parseDoublePrecist } from '@/utils/math';
import ChartBPM from './BPM';
import { BeatArray } from '@/utils/types';

const BPMSortFn = (a: ChartBPM, b: ChartBPM) => BeatArrayToNumber(a.beat) - BeatArrayToNumber(b.beat);

export default class ChartBPMList extends Array<ChartBPM> {
  constructor() {
    super();

    // Add default BPM
    this.push(
      new ChartBPM([ 0, 0, 1 ], 120)
    );

    // Init
    this.calcRealTime();
  }

  add(beat: BeatArray, bpm: number) {
    this.push(new ChartBPM(beat, bpm));
    this.calcRealTime();
    return this;
  }

  remove(index: number) {
    if (this.length === 1) throw new Error('Cannot remove BPM when only one BPM exists.');

    this.splice(index, 1);
    this.calcRealTime();
    return this;
  }

  edit(index: number, newBPM?: number, newBeat?: BeatArray) {
    const bpm = this[index];
    if (!bpm) throw new Error(`BPM index #${index} not found`);

    if (newBPM) bpm.bpm = newBPM;
    if (newBeat) {
      bpm.beat = newBeat;
      bpm.beatNum = BeatArrayToNumber(newBeat);
    }

    if (newBPM || newBeat) this.calcRealTime();
    return bpm;
  }

  getRealTime(beat: BeatArray | number) {
    if (typeof beat === 'number') return this.getRealTimeByBeatNum(beat);
    else return this.getRealTimeByBeatNum(BeatArrayToNumber(beat));
  }

  timeToBeatNum(time: number) {
    for (const bpm of this) {
      if (bpm.endTime <= time) continue;
      if (bpm.time > time) break;

      return parseDoublePrecist(bpm.beatNum + (time - bpm.time) / bpm.timePerBeat, 6, -1);
    }

    throw new Error(`Cannot found beat number for time ${time}`);
  }

  private calcRealTime() {
    this.sort(BPMSortFn);
    if (BeatArrayToNumber(this[0].beat) !== 0) {
      this[0].beat = [ 0, 0, 1 ];
      this[0].beatNum = 0;
    }

    let currentTimePerBeat = this[0].timePerBeat;
    let bpmChangedBeat = 0;
    let bpmChangedTime = 0;

    for (let i = 0; i < this.length; i++) {
      const bpm = this[i];
      const bpmNext = this[i + 1];

      bpmChangedTime = parseDoublePrecist(bpmChangedTime + (
        currentTimePerBeat * (bpm.beatNum - bpmChangedBeat)
      ), 6, -1);
      bpmChangedBeat = parseDoublePrecist(bpmChangedBeat + (
        bpm.beatNum - bpmChangedBeat
      ), 6, -1);
      currentTimePerBeat = bpm.timePerBeat;

      bpm.time = bpmChangedTime;
      bpm.endBeat = bpmNext ? bpmNext.beat : [ Infinity, 0, 1 ];
      bpm.endBeatNum = bpmNext ? BeatArrayToNumber(bpmNext.beat) : Infinity;
      bpm.endTime = bpmNext ? parseDoublePrecist(bpm.time + (
        bpm.timePerBeat * (bpm.endBeatNum - bpm.beatNum)
      ), 6, -1) : Infinity;
    }
  }

  private getRealTimeByBeatNum(beat: number) {
    if (!isFinite(beat)) return beat;

    for (const bpm of this) {
      if (bpm.endBeatNum <= beat) continue;
      if (bpm.beatNum > beat) break;

      return parseDoublePrecist(bpm.time + (beat - bpm.beatNum) * bpm.timePerBeat, 6, -1);
    }

    throw new Error(`Cannot found BPM for beat ${JSON.stringify(beat)}`);
  }
}
