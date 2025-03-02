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
  readonly audio: AudioClass = Audio;
  readonly assets: AssetsManager = Assets;
  readonly events = new EventEmitter();
  readonly hotkeys = new Hotkeys(this.events);
  private currentChart: Nullable<Chart> = null;
}

const app = new App();
export default app;

console.log(app);
