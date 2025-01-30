import Chart from '../Chart';
import { HistoryType } from './types';

class ChartHistory extends Array<HistoryType> {
  readonly chart: Chart;
  currentIndex = 0;

  constructor(chart: Chart, histories?: HistoryType[]) {
    super();

    this.chart = chart;
    if (histories) this.push(...histories);
  }

  add(action: HistoryType) {
    this.unshift(action);
    this.currentIndex = 0;
    // TODO: History count in settings
    if (this.length > 20) this.length = 20;
  }

  
}

export default ChartHistory;
