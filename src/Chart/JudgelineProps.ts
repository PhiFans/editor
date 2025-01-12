import { BeatArray } from '@/utils/types';
import ChartKeyframe from './Keyframe';
import { ArrayEvented } from '@/utils/class';
import ChartBPMList from './BPMList';

const PropsSortFn = (a: ChartKeyframe, b: ChartKeyframe) => a.beatNum - b.beatNum;

export default class ChartJudgelineProps {
  speed = new ArrayEvented<ChartKeyframe>();
  positionX = new ArrayEvented<ChartKeyframe>();
  positionY = new ArrayEvented<ChartKeyframe>();
  alpha = new ArrayEvented<ChartKeyframe>();
  rotate = new ArrayEvented<ChartKeyframe>();

  addKeyframe(
    type: keyof ChartJudgelineProps,
    beat: BeatArray,
    value: number,
    continuous: boolean,
    easing: number,
    BPMs: ChartBPMList
  ) {
    const keyframeArr = this[type];
    if (!keyframeArr || !(keyframeArr instanceof Array)) throw new Error(`No such type: ${type}`);

    const newKeyframe = new ChartKeyframe(beat, value, continuous, easing);
    keyframeArr.push(newKeyframe);

    this.calcPropsTime(BPMs);

    keyframeArr.event.emit('keyframe.added', newKeyframe);
    keyframeArr.event.emit('keyframes.updated', keyframeArr);
  }

  private sortProps() {
    this.speed.sort(PropsSortFn);
    this.positionX.sort(PropsSortFn);
    this.positionY.sort(PropsSortFn);
    this.alpha.sort(PropsSortFn);
    this.rotate.sort(PropsSortFn);
  }

  private calcPropTime<T extends Array<ChartKeyframe>>(keyframes: T, BPMs: ChartBPMList) {
    for (const keyframe of keyframes) {
      if (!isNaN(keyframe.time)) continue;
      keyframe.time = BPMs.getRealTime(keyframe.beat);
    }

    return keyframes;
  }

  private calcPropsTime(BPMs: ChartBPMList) {
    this.sortProps();

    this.speed = this.calcPropTime(this.speed, BPMs);
    this.positionX = this.calcPropTime(this.positionX, BPMs);
    this.positionY = this.calcPropTime(this.positionY, BPMs);
    this.alpha = this.calcPropTime(this.alpha, BPMs);
    this.rotate = this.calcPropTime(this.rotate, BPMs);
  }
}
