import { EventEmitter } from "eventemitter3";
import Audio, { Audio as AudioClass } from "@/Audio/Audio";
import Chart from "@/Chart/Chart";
import Assets, { AssetsManager } from '@/Assets/Assets';
import { Hotkeys } from './Hotkeys';
import { ChartInfo } from "@/Chart/types";
import { Nullable } from "@/utils/types";

export class App {
  readonly audio: AudioClass = Audio;
  readonly assets: AssetsManager = Assets;
  readonly events = new EventEmitter();
  readonly hotkeys = new Hotkeys(this.events);
  private currentChart: Nullable<Chart> = null;

  createChart(info: ChartInfo, audio: File, background: File, applyToApp: boolean = false) {
    const newChart = new Chart(info, audio, background);
    if (applyToApp) {
      this.currentChart = newChart;
      this.events.emit('chart.set', newChart);
    }
    return newChart;
  }

  get chart() {
    return this.currentChart;
  }
}

const app = new App();
export default app;

console.log(app);
