import Audio, { Audio as AudioClass } from "@/Audio/Audio";
import Chart from "@/Chart/Chart";
import { Nullable } from "@/utils/types";

export class App {
  readonly audio: AudioClass = Audio;
  private currentChart: Nullable<Chart> = null;

  get chart() {
    return this.currentChart;
  }
}

const app = new App();
export default app;
