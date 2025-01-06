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

  play() {
    if (!this.chart) return;
    if (!this.chart.audioClip) return;
    this.chart.audioClip.play();
  }

  pause() {
    if (!this.chart) return;
    if (!this.chart.audioClip) return;
    this.chart.audioClip.pause();
  }

  stop() {
    if (!this.chart) return;
    if (!this.chart.audioClip) return;
    this.chart.audioClip.stop();
  }

  seek(seconds: number) {
    if (!this.chart) return;
    if (!this.chart.audioClip) return;
    this.chart.audioClip.seek(seconds);
  }

  get duration() {
    if (!this.chart) return 0;
    if (!this.chart.audioClip) return 0;
    return this.chart.audioClip.duration;
  }

  get time() {
    if (!this.chart) return 0;
    if (!this.chart.audioClip) return 0;
    return this.chart.audioClip.time;
  }

  get chart() {
    return this.currentChart;
  }
}

const app = new App();
export default app;

console.log(app);
