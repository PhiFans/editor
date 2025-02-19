import { BeatArrayToNumber, parseDoublePrecist } from '@/utils/math';
import ChartBPM, { ChartBPMExported } from './BPM';
import { BeatArray } from '@/utils/types';

const BPMSortFn = (a: ChartBPM, b: ChartBPM) => BeatArrayToNumber(a.beat) - BeatArrayToNumber(b.beat);

export default class ChartBPMList extends Array<ChartBPM> {
  add(beat: BeatArray, bpm: number) {
    const newBPM = new ChartBPM(beat, bpm);
    this.push(newBPM);
    this.calcRealTime();
    return newBPM;
  }

  remove(id: string) {
    if (this.length === 1) return;

    const bpmIndex = this.findIndex((e) => e.id === id);
    if (bpmIndex === -1) return;
    const oldBPM = this[bpmIndex];

    this.splice(bpmIndex, 1);
    this.calcRealTime();
    return oldBPM;
  }

  edit(id: string, newBPM?: number, newBeat?: BeatArray) {
    const bpm = this.findByID(id);
    if (!bpm) return;

    if (newBPM) bpm.bpm = newBPM;
    if (newBeat) bpm.beat = newBeat;

    bpm.update();
    this.calcRealTime();
    return bpm;
  }

  findByID(id: string) {
    const bpm = this.find((e) => e.id === id);
    return bpm;
  }

  findByTime(beat: BeatArray) {
    const beatNum = BeatArrayToNumber(beat);
    const bpm = this.find((e) => e.beatNum === beatNum);
    return bpm;
  }

  getRealTime(beat: BeatArray | number) {
    if (typeof beat === 'number') return this.getRealTimeByBeatNum(beat);
    else return this.getRealTimeByBeatNum(BeatArrayToNumber(beat));
  }

  timeToBeatNum(time: number) {
    if (this.length === 1 || time < 0) return parseDoublePrecist(time / this[0].timePerBeat, 6, -1);

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

  get json(): ChartBPMExported[] {
    return this.map((e) => e.json);
  }

  private getRealTimeByBeatNum(beat: number) {
    if (!isFinite(beat)) return beat;
    if (this.length <= 0) return parseDoublePrecist(beat * 0.5, 6, -1);
    if (this.length === 1 || beat < 0) return parseDoublePrecist((beat - this[0].beatNum) * this[0].timePerBeat, 6, -1);

    for (const bpm of this) {
      if (bpm.endBeatNum <= beat) continue;
      if (bpm.beatNum > beat) break;

      return parseDoublePrecist(bpm.time + (beat - bpm.beatNum) * bpm.timePerBeat, 6, -1);
    }

    throw new Error(`Cannot found BPM for beat ${JSON.stringify(beat)}`);
  }
}
