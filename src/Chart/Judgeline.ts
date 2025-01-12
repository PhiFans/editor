import { BeatArray } from '@/utils/types';
import ChartBPMList from './BPMList';
import JudgelineProps from './JudgelineProps';
import Note from './Note';
import { EventEmitter } from 'pixi.js';

export default class ChartJudgeline {
  bpm: ChartBPMList;
  props = new JudgelineProps();
  notes: Note[] = [];
  events: EventEmitter = new EventEmitter();

  constructor(bpmList: ChartBPMList) {
    this.bpm = bpmList;

    this.addKeyframe('speed', [ 0, 0, 1 ], 1, false, 1);
    this.addKeyframe('positionX', [ 0, 0, 1 ], 0, false, 1);
    this.addKeyframe('positionY', [ 0, 0, 1 ], 0, false, 1);
    this.addKeyframe('alpha', [ 0, 0, 1 ], 1, false, 1);
    this.addKeyframe('rotate', [ 0, 0, 1 ], 0, false, 1);
  }

  addKeyframe(type: keyof JudgelineProps, beat: BeatArray, value: number, continuous: boolean, easing: number) {
    this.props.addKeyframe(type, beat, value, continuous, easing, this.bpm);
  }
}
