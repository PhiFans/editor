import ChartBPM from './BPM';
import ChartJudgeline from './Judgeline';
import ChartNote from './Note';

export default class Chart {
  bpm: ChartBPM[] = [ new ChartBPM([0, 0, 1], 120) ];
  lines: ChartJudgeline[] = [];
  notes: ChartNote[] = [];
}
