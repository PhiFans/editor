import { EventEmitter } from 'pixi.js';
import { BeatArray } from '@/utils/types';
import ChartBPMList from './BPMList';
import JudgelineProps, { TChartJudgelineProps } from './JudgelineProps';
import ChartKeyframe from './Keyframe';
import Note from './Note';

const PropsSortFn = (a: ChartKeyframe, b: ChartKeyframe) => a.beatNum - b.beatNum;

export default class ChartJudgeline {
  bpm: ChartBPMList;
  props = new JudgelineProps();
  notes: Note[] = [];

  readonly events: EventEmitter = new EventEmitter();

  constructor(bpmList: ChartBPMList) {
    this.bpm = bpmList;

    this.calcPropsTime();
  }

  addKeyframe(
    type: keyof TChartJudgelineProps,
    beat: BeatArray,
    value: number,
    continuous: boolean,
    easing: number
  ) {
    const keyframeArr = this.props[type];
    if (!keyframeArr || !(keyframeArr instanceof Array)) throw new Error(`No such type: ${type}`);

    const newKeyframe = new ChartKeyframe(beat, value, continuous, easing);
    keyframeArr.push(newKeyframe);

    this.calcPropsTime();
    this.events.emit('props.updated', { type, keyframes: [ ...keyframeArr ] });
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
