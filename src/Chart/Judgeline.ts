import { BeatArray } from '@/utils/types';
import ChartBPMList from './BPMList';
import JudgelineProps from './JudgelineProps';
import Note from './Note';
import ChartKeyframe from './Keyframe';

const PropsSortFn = (a: ChartKeyframe, b: ChartKeyframe) => a.beatNum - b.beatNum;

export default class ChartJudgeline {
  bpm: ChartBPMList;
  props = new JudgelineProps();
  notes: Note[] = [];

  constructor(bpmList: ChartBPMList) {
    this.bpm = bpmList;

    this.calcPropsTime();
  }

  addKeyframe(type: keyof JudgelineProps, beat: BeatArray, value: number, continuous: boolean, easing: number) {
    const keyframes = this.props[type];
    if (!keyframes) throw new Error(`No such keyframe type: ${type}`);

    keyframes.push(
      new ChartKeyframe(beat, value, continuous, easing)
    );
    this.calcPropsTime();
  }

  private sortProps() {
    this.props.speed.sort(PropsSortFn);
    this.props.positionX.sort(PropsSortFn);
    this.props.positionY.sort(PropsSortFn);
    this.props.alpha.sort(PropsSortFn);
    this.props.rotate.sort(PropsSortFn);
  }

  private calcPropTime(keyframes: ChartKeyframe[]) {
    for (const keyframe of keyframes) {
      if (!isNaN(keyframe.time)) continue;
      keyframe.time = this.bpm.getRealTime(keyframe.beat);
    }

    return keyframes;
  }

  private calcPropsTime() {
    this.sortProps();

    this.props.speed = this.calcPropTime(this.props.speed);
    this.props.positionX = this.calcPropTime(this.props.positionX);
    this.props.positionY = this.calcPropTime(this.props.positionY);
    this.props.alpha = this.calcPropTime(this.props.alpha);
    this.props.rotate = this.calcPropTime(this.props.rotate);
  }
}
