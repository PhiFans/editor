import Audio, { Audio as AudioClass } from "@/Audio/Audio";
import Chart from "@/Chart/Chart";
import { ChartInfo } from "@/Chart/types";
import { Nullable } from "@/utils/types";

export class App {
  readonly audio: AudioClass = Audio;
  private currentChart: Nullable<Chart> = null;

  createChart(info: ChartInfo, audio: File, background: File, applyToApp: boolean = false) {
    const newChart = new Chart(info, audio, background);
    if (applyToApp) this.currentChart = newChart;
    return newChart;
  }

  get chart() {
    return this.currentChart;
  }
}

const app = new App();
export default app;

console.log(app);
