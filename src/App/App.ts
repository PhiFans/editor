import { EventEmitter } from "eventemitter3";
import Audio, { Audio as AudioClass } from "@/Audio/Audio";
import Chart, { ChartExported } from "@/Chart/Chart";
import Assets, { AssetsManager } from '@/Assets/Assets';
import { Hotkeys } from './Hotkeys';
import { ChartInfo } from "@/Chart/types";
import { Nullable } from "@/utils/types";
import { Ticker } from "pixi.js";
import { ImportChart } from "@/utils/file";

export class App {
  readonly chartTicker: Ticker = new Ticker();
  readonly audio: AudioClass = Audio;
  readonly assets: AssetsManager = Assets;
  readonly events = new EventEmitter();
  readonly hotkeys = new Hotkeys(this.events);
  private currentChart: Nullable<Chart> = null;

  constructor() {
    this.chartTicker.start();
  }

  createChart(info: ChartInfo, audio: File, background: File, applyToApp: boolean = false) {
    const newChart = new Chart(info, audio, background);
    if (applyToApp) {
      if (this.currentChart) this.chartTicker.remove(this.currentChart.tick);

      this.currentChart = newChart;
      this.chartTicker.add(newChart.tick);
      this.events.emit('chart.set', newChart);
    }
    return newChart;
  }

  loadChart(chart: ChartExported, audio: File, background: File) {
    const newChart = ImportChart(chart, audio, background);

    if (this.currentChart) this.chartTicker.remove(this.currentChart.tick);
    this.currentChart = newChart;
    this.chartTicker.add(newChart.tick);
    this.events.emit('chart.set', newChart);

    return newChart;
  }

  get chart() {
    return this.currentChart;
  }
}

const app = new App();
export default app;

console.log(app);
