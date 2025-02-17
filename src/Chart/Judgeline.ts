import { v4 as uuid } from 'uuid';
import { EventEmitter } from 'eventemitter3';
import { BeatArray, RendererSize } from '@/utils/types';
import JudgelineProps, { ChartJudgelinePropsExported, TChartJudgelineProps } from './JudgelineProps';
import ChartKeyframe, { TChartKeyframe } from './Keyframe';
import Note, { ChartNoteExported, ChartNoteProps } from './Note';
import { BeatArrayToNumber, parseDoublePrecist } from '@/utils/math';
import { getLinePropValue } from '@/utils/chart';
import { Container, Sprite, Texture } from 'pixi.js';
import Chart from './Chart';
import { FloorPosition, NoteType } from './types';

const PropsSortFn = (a: ChartKeyframe, b: ChartKeyframe) => a.beatNum - b.beatNum;

export type ChartJudgelineExported = {
  props: ChartJudgelinePropsExported,
  notes: ChartNoteExported[],
};

export default class ChartJudgeline {
  /** Internal property */
  readonly id: string;
  readonly chart: Chart;

  props: JudgelineProps;
  floorPositions: FloorPosition[] = [];
  notes: Note[] = [];

  // Used for live preview
  _speed: number = 1;
  _posX: number = 0;
  _posY: number = 0;
  _alpha: number = 1;
  _rotate: number = 0;

  _fPos: number = 0;
  _realPosX: number = 0;
  _realPosY: number = 0;
  _radian: number = 0;
  _cosr: number = 0;
  _sinr: number = 0;

  readonly events: EventEmitter = new EventEmitter();
  sprite!: Sprite;

  constructor(chart: Chart, addDefaultKeyframes = true, id = uuid()) {
    this.id = id;
    this.chart = chart;

    this.props = new JudgelineProps(addDefaultKeyframes);

    if (addDefaultKeyframes) {
      this.updateProp('speed', true);
      this.updateProp('positionX', true);
      this.updateProp('positionY', true);
      this.updateProp('rotate', true);
      this.updateProp('alpha', true);

      this.calcFloorPositions();
    }

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

    this.updateProp(type);
    if (type === 'speed') {
      this.calcFloorPositions();
      this.updateNotesFloorPosition();
    }

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

    const prevKeyframe = keyframeArr.find((e) => e.nextKeyframe && e.nextKeyframe.id === keyframe.id);
    if (prevKeyframe) prevKeyframe.nextKeyframe = null;

    for (const name in newProps) {
      // XXX: This sucks
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      keyframe[name] = newProps[name];
    }

    keyframe.beatNum = BeatArrayToNumber(keyframe.beat);
    keyframe.time = this.chart.bpm.getRealTime(keyframe.beat);

    this.updateProp(type);
    if (type === 'speed') {
      this.calcFloorPositions();
      this.updateNotesFloorPosition();
    }

    this.events.emit('props.updated', { type, keyframes: [ ...keyframeArr ] });
  }

  deleteKeyframe(type: keyof TChartJudgelineProps, id: string) {
    const keyframeArr = this.props[type];
    if (!keyframeArr || !(keyframeArr instanceof Array)) throw new Error(`No such type: ${type}`);
    if (keyframeArr.length === 1) return;

    const keyframeIndex = keyframeArr.findIndex((e) => e.id === id);
    if (keyframeIndex === -1) throw new Error(`Cannot find keyframe ID: "${id}" for props ${type}`);

    const prevKeyframe = keyframeArr.find((e) => e.nextKeyframe && e.nextKeyframe.id === id);
    if (prevKeyframe) prevKeyframe.nextKeyframe = null;

    // const keyframe = keyframeArr[keyframeIndex];
    keyframeArr.splice(keyframeIndex, 1);

    this.updateProp(type);
    if (type === 'speed') {
      this.calcFloorPositions();
      this.updateNotesFloorPosition();
    }

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

    if (newProps['type'] !== (void 0)) note.createSprite(this.sprite.parent);
    note.resize(this.chart.rendererSize);

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

  getFloorPosition(time: number) {
    const getFloorPosition = (time: number) => {
      for (const event of this.floorPositions) {
        if (event.endTime <= time) continue;
        if (event.time > time) break;

        return event;
      }

      return {
        time,
        endTime: Infinity,
        value: time,
      };
    };

    const speed = getLinePropValue(time, this.props.speed, 1);
    const floorPosition = getFloorPosition(time);

    return parseDoublePrecist(floorPosition.value + (speed * (time - floorPosition.time)), 3, 1);
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

  updateProp(type: keyof TChartJudgelineProps, forceUpdateTime = false) {
    this.props[type].sort(PropsSortFn);
    this.props[type] = this.calcPropTime(this.props[type], forceUpdateTime);
    return this.props[type];
  }

  destroy() {
    this.sprite.removeFromParent();
    this.sprite.destroy();

    for (const note of this.notes) {
      if (!note.sprite) continue;
      note.sprite.removeFromParent();
      note.sprite.destroy();
    }
  }

  get json(): ChartJudgelineExported {
    return {
      props: this.props.json,
      notes: this.notes.map((e) => e.json),
    };
  }

  private calcPropTime(keyframes: ChartKeyframe[], forceUpdateTime = false) {
    for (let i = 0; i < keyframes.length; i++) {
      const keyframe = keyframes[i];
      const keyframeNext = keyframes[i + 1];

      if (isNaN(keyframe.time) || forceUpdateTime) keyframe.time = this.chart.bpm.getRealTime(keyframe.beat);

      if (!keyframeNext) continue;
      if (keyframeNext.continuous) {
        keyframe.nextKeyframe = keyframeNext
      } else {
        keyframe.nextKeyframe = null;
      }
    }

    return keyframes;
  }

  private sortNotes() {
    this.notes.sort((a, b) => BeatArrayToNumber(a.beat) - BeatArrayToNumber(b.beat));
  }

  calcNoteTime(note: Note) {
    note.time = this.chart.bpm.getRealTime(note.beat);
    note.holdEndTime = this.chart.bpm.getRealTime(note.holdEndBeat);
    this.updateNoteFloorPosition(note);

    return note;
  }

  calcFloorPositions() {
    this.floorPositions.length = 0;

    for (const keyframe of this.props.speed) {
      const { nextKeyframe } = keyframe;
      if (!nextKeyframe || nextKeyframe.value === keyframe.value) {
        this.floorPositions.push({
          time: keyframe.time,
          endTime: NaN,
          value: NaN,
        });
        continue;
      }

      const beatBetween = nextKeyframe.beatNum - keyframe.beatNum;
      for (let i = 0, count = Math.ceil(beatBetween / 0.125); i < count; i++) {
        const beatPercent = i / count;
        const beatPercentNext = i < count - 1 ? (i + 1) / count : 1;
        const currentTime = keyframe.time * (1 - beatPercent) + nextKeyframe.time * beatPercent;
        const nextTime = keyframe.time * (1 - beatPercentNext) + nextKeyframe.time * beatPercentNext;

        this.floorPositions.push({
          time: currentTime,
          endTime: nextTime,
          value: NaN,
        });
      }

      this.floorPositions.push({
        time: nextKeyframe.time,
        endTime: NaN,
        value: NaN,
      });
    }

    this.floorPositions.sort((a, b) => a.time - b.time);
    if (this.floorPositions[0].time !== 0) {
      this.floorPositions.unshift({
        time: 0,
        endTime: this.floorPositions[0].time,
        value: 0,
      });
    }

    let currentFloorPosition = 0;
    for (let i = 0; i < this.floorPositions.length; i++) {
      const event = this.floorPositions[i];
      const eventNext = this.floorPositions[i + 1];

      event.value = currentFloorPosition;
      event.endTime = eventNext ? eventNext.time : Infinity;

      if (eventNext) currentFloorPosition = parseDoublePrecist(currentFloorPosition +
        (eventNext.time - event.time) * getLinePropValue(event.time, this.props.speed, 1)
      , 3, -1);
    }
  }

  private updateNoteFloorPosition(note: Note) {
    note.floorPosition = this.getFloorPosition(note.time);
    if (note.type === NoteType.HOLD) note.holdEndPosition = this.getFloorPosition(note.holdEndTime);
    else note.holdEndPosition = note.floorPosition;

    note.updateHoldProps();
  }

  updateNotesFloorPosition() {
    for (const note of this.notes) {
      this.updateNoteFloorPosition(note);
      note.resize(this.chart.rendererSize);
    }
  }
}
