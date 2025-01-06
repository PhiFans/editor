import ChartBPM from './BPM';
import ChartJudgeline from './Judgeline';
import ChartNote from './Note';
import { ChartInfo } from './types';

export default class Chart {
  info: ChartInfo;
  audio: File;
  background: File;

  bpm: ChartBPM[] = [ new ChartBPM([0, 0, 1], 120) ];
  lines: ChartJudgeline[] = [];
  notes: ChartNote[] = [];

  constructor(info: ChartInfo, audio: File, background: File) {
    this.info = info;
    this.audio = audio;
    this.background = background;
  }
}
