import { Ticker } from 'pixi.js';
import { resumeAudioCtx } from './utils';

export default class AudioClock {
  /**
   * The current audio time.
   */
  public time: number = 0;

  private offsets: number[] = [];
  private sum: number = 0;

  private readonly audioCtx: AudioContext;
  private readonly ticker: Ticker;
  private readonly baseOffset;

  constructor(audioCtx: AudioContext, ticker: Ticker, baseOffset: number = 0) {
    this.audioCtx = audioCtx;
    this.ticker = ticker;
    this.baseOffset = baseOffset;

    this.calcTick = this.calcTick.bind(this);
    this.init().catch(() => void 0);
  }

  private async init() {
    this.audioCtx.addEventListener('statechange', () => {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      if (this.audioCtx.state === 'running') this.ticker.add(this.calcTick);
    });

    await resumeAudioCtx(this.audioCtx);
    this.ticker.start();
  }

  private calcTick() {
    const { audioCtx, baseOffset, offsets } = this;
    const realTime = performance.now() / 1000;
    const delta = realTime - audioCtx.currentTime - baseOffset;

    offsets.push(delta);
    this.sum += delta;

    while(offsets.length > 60) {
      this.sum -= offsets.shift()!;
    }

    this.time = realTime - this.sum / offsets.length;
  }
}
