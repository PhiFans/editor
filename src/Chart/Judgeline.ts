import { v4 as uuid } from 'uuid';
import { EventEmitter } from 'eventemitter3';
import { BeatArray } from '@/utils/types';
import ChartBPMList from './BPMList';
import JudgelineProps, { TChartJudgelineProps } from './JudgelineProps';
import ChartKeyframe, { TChartKeyframe } from './Keyframe';
import Note from './Note';
import { BeatArrayToNumber } from '@/utils/math';

const PropsSortFn = (a: ChartKeyframe, b: ChartKeyframe) => a.beatNum - b.beatNum;

export default class ChartJudgeline {
  /** Internal property */
  readonly id: string;

  bpm: ChartBPMList;
  props = new JudgelineProps();
  notes: Note[] = [];

  readonly events: EventEmitter = new EventEmitter();

  constructor(bpmList: ChartBPMList, id = uuid()) {
    this.id = id;
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
    if (this.findKeyframeByBeat(type, beat)) return;

    const newKeyframe = new ChartKeyframe(beat, value, continuous, easing);
    keyframeArr.push(newKeyframe);

    this.calcPropsTime();
    this.events.emit('props.updated', { type, keyframes: [ ...keyframeArr ] });
  }

  editKeyframe(
    type: keyof TChartJudgelineProps,
    id: string,
    newProps: Partial<TChartKeyframe> = {}
  ) {
    const keyframeArr = this.props[type];
    if (!keyframeArr || !(keyframeArr instanceof Array)) throw new Error(`No such type: ${type}`);

    const keyframe = this.findKeyframeById(type, id);
    if (!keyframe) throw new Error(`Cannot found keyframe ID: "${id}" for props ${type}`);
    if (newProps.beat && this.findKeyframeByBeat(type, newProps.beat)) return;

    for (const name in newProps) {
      // XXX: This sucks
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      keyframe[name] = newProps[name];
    }

    keyframe.beatNum = BeatArrayToNumber(keyframe.beat);

    this.calcPropsTime();
    this.events.emit('props.updated', { type, keyframes: [ ...keyframeArr ] });
  }

  findKeyframeByBeat(type: keyof TChartJudgelineProps, beat: BeatArray) {
    const keyframeArr = this.props[type];
    if (!keyframeArr || !(keyframeArr instanceof Array)) throw new Error(`No such type: ${type}`);

    const beatNum = BeatArrayToNumber(beat);
    return keyframeArr.find((e) => e.beatNum === beatNum);
  }

  findKeyframeById(type: keyof TChartJudgelineProps, id: string) {
    const keyframeArr = this.props[type];
    if (!keyframeArr || !(keyframeArr instanceof Array)) throw new Error(`No such type: ${type}`);

    return keyframeArr.find((e) => e.id === id);
  }

  findNoteById(id: string) {
    return this.notes.find((e) => e.id === id);
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
