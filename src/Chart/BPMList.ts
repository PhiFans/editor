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
    if (newBeat) bpm.beat = newBeat;

    if (newBPM || newBeat) this.calcRealTime();
    return bpm;
  }

  getRealTime(beat: BeatArray) {
    const beatNum = BeatArrayToNumber(beat);
    if (!isFinite(beatNum)) return beatNum;

    for (const bpm of this) {
      const startBeat = BeatArrayToNumber(bpm.beat);
      const endBeat = BeatArrayToNumber(bpm.endBeat);

      if (endBeat <= beatNum) continue;
      if (startBeat > beatNum) break;

      return parseDoublePrecist(bpm.time + (beatNum - startBeat) * bpm.timePerBeat, 6, -1);
    }

    throw new Error(`Cannot found BPM for beat ${JSON.stringify(beat)}`);
  }

  timeToBeatNum(time: number) {
    for (const bpm of this) {
      if (bpm.endTime <= time) continue;
      if (bpm.time > time) break;

      return parseDoublePrecist(BeatArrayToNumber(bpm.beat) + (time - bpm.time) / bpm.timePerBeat, 6, -1);
    }

    throw new Error(`Cannot found beat number for time ${time}`);
  }

  private calcRealTime() {
    this.sort(BPMSortFn);
    if (BeatArrayToNumber(this[0].beat) !== 0) this[0].beat = [ 0, 0, 1 ];

    let currentTimePerBeat = this[0].timePerBeat;
    let bpmChangedBeat = 0;
    let bpmChangedTime = 0;

    for (let i = 0; i < this.length; i++) {
      const bpm = this[i];
      const bpmNext = this[i + 1];

      const startBeat = BeatArrayToNumber(bpm.beat);

      bpmChangedTime = parseDoublePrecist(bpmChangedTime + (
        currentTimePerBeat * (startBeat - bpmChangedBeat)
      ), 6, -1);
      bpmChangedBeat = parseDoublePrecist(bpmChangedBeat + (
        startBeat - bpmChangedBeat
      ), 6, -1);
      currentTimePerBeat = bpm.timePerBeat;

      bpm.time = bpmChangedTime;
      bpm.endBeat = bpmNext ? bpmNext.beat : [ Infinity, 0, 1 ];
      bpm.endTime = bpmNext ? parseDoublePrecist(bpm.time + (
        bpm.timePerBeat * (BeatArrayToNumber(bpmNext.beat) - startBeat)
      ), 6, -1) : Infinity;
    }
  }
}
