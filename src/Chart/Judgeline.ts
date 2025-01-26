import { v4 as uuid } from 'uuid';
import { EventEmitter } from 'eventemitter3';
import { BeatArray, RendererSize } from '@/utils/types';
import JudgelineProps, { TChartJudgelineProps } from './JudgelineProps';
import ChartKeyframe, { TChartKeyframe } from './Keyframe';
import Note, { ChartNoteProps } from './Note';
import { BeatArrayToNumber } from '@/utils/math';
import { Container, Sprite, Texture } from 'pixi.js';
import Chart from './Chart';

const PropsSortFn = (a: ChartKeyframe, b: ChartKeyframe) => a.beatNum - b.beatNum;

export default class ChartJudgeline {
  /** Internal property */
  readonly id: string;
  readonly chart: Chart;

  props = new JudgelineProps();
  notes: Note[] = [];

  readonly events: EventEmitter = new EventEmitter();
  sprite!: Sprite;

  constructor(chart: Chart, id = uuid()) {
    this.id = id;
    this.chart = chart;

    this.calcPropsTime();
    this.createSprite();
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

    const newKeyframe = new ChartKeyframe(type, beat, value, continuous, easing);
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
    if (!keyframe) throw new Error(`Cannot find keyframe ID: "${id}" for props ${type}`);
    if (newProps.beat && this.findKeyframeByBeat(type, newProps.beat)) return;

    for (const name in newProps) {
      // XXX: This sucks
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      keyframe[name] = newProps[name];
    }

    keyframe.beatNum = BeatArrayToNumber(keyframe.beat);
    keyframe.time = this.chart.bpm.getRealTime(keyframe.beat);

    this.calcPropsTime();
    this.events.emit('props.updated', { type, keyframes: [ ...keyframeArr ] });
  }

  deleteKeyframe(type: keyof TChartJudgelineProps, id: string) {
    const keyframeArr = this.props[type];
    if (!keyframeArr || !(keyframeArr instanceof Array)) throw new Error(`No such type: ${type}`);
    if (keyframeArr.length === 1) return;

    const keyframeIndex = keyframeArr.findIndex((e) => e.id === id);
    if (keyframeIndex === -1) throw new Error(`Cannot find keyframe ID: "${id}" for props ${type}`);

    // const keyframe = keyframeArr[keyframeIndex];
    keyframeArr.splice(keyframeIndex, 1);

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

  addNote(props: Omit<ChartNoteProps, 'line'>, id = uuid()) {
    const note = this.calcNoteTime(new Note({
      ...props,
      line: this,
    }, id));
    this.notes.push(note);
    this.sortNotes();

    note.resize(this.chart.rendererSize);
    this.sprite.parent.addChild(note.sprite!);

    this.events.emit('note.added', note);
    this.events.emit('notes.updated', [ ...this.notes ]);

    return note;
  }

  editNote(id: string, newProps: Partial<Omit<ChartNoteProps, 'line'>>) {
    const note = this.findNoteById(id);
    if (!note) throw new Error(`Cannot find note ID: "${id}" for line "${this.id}"`);

    for (const name in newProps) {
      // XXX: This sucks
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      note[name] = newProps[name];
    }

    note.beatNum = BeatArrayToNumber(note.beat);
    note.updateHoldProps();
    this.calcNoteTime(note);
    this.sortNotes();

    note.resize(this.chart.rendererSize);
    if (newProps['type'] !== (void 0)) note.createSprite(this.sprite.parent);

    this.events.emit('notes.updated', [ ...this.notes ]);
  }

  deleteNote(id: string) {
    const noteIndex = this.notes.findIndex((e) => e.id === id);
    if (noteIndex === -1) throw new Error(`Cannot find note ID: "${id}" for line "${this.id}"`);

    const note = this.notes[noteIndex];
    this.notes.splice(noteIndex, 1);
    note.sprite!.removeFromParent();
    note.sprite!.destroy();

    this.events.emit('note.removed', note);
    this.events.emit('notes.updated', [ ...this.notes ]);
  }

  findNoteById(id: string) {
    return this.notes.find((e) => e.id === id);
  }

  createSprite(container?: Container) {
    this.sprite = new Sprite(Texture.WHITE);

    this.sprite.width = 1920;
    this.sprite.height = 3;
    this.sprite.anchor.set(0.5);

    if (container) container.addChild(this.sprite);
    return this.sprite;
  }

  resize(size: RendererSize) {
    const scaleX = Math.round((4000 / 1920) * (size.width / 1350) * 1920);
    const scaleY = Math.round(size.lineScale * 18.75 * 0.008);

    this.sprite.scale.set(scaleX, scaleY);

    for (const note of this.notes) {
      note.resize(size);
    }
  }

  private sortProps() {
    this.props.speed.sort(PropsSortFn);
    this.props.positionX.sort(PropsSortFn);
    this.props.positionY.sort(PropsSortFn);
    this.props.alpha.sort(PropsSortFn);
    this.props.rotate.sort(PropsSortFn);
  }

  private calcPropTime(keyframes: ChartKeyframe[]) {
    for (let i = 0; i < keyframes.length; i++) {
      const keyframe = keyframes[i];
      const keyframePrev = keyframes[i - 1];

      if (isNaN(keyframe.time)) keyframe.time = this.chart.bpm.getRealTime(keyframe.beat);
      if (keyframePrev) {
        if (keyframe.continuous) keyframe.nextKeyframe = keyframePrev;
        else keyframe.nextKeyframe = null;
      }
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

  private sortNotes() {
    this.notes.sort((a, b) => BeatArrayToNumber(a.beat) - BeatArrayToNumber(b.beat));
  }

  private calcNoteTime(note: Note) {
    note.time = this.chart.bpm.getRealTime(note.beat);
    note.holdEndTime = this.chart.bpm.getRealTime(note.holdEndBeat);
    note.holdLengthTime = note.holdEndTime - note.time;

    return note;
  }
}
