import { Ticker } from 'pixi.js';
import { GameAudio } from '.';
import { GameAudioClip } from './clip';

export class GameAudioChannel {
  private readonly audioCtx: AudioContext;
  private readonly ticker: Ticker;
  readonly gain: GainNode;
  readonly playlist: Array<GameAudioClip> = [];

  private isTickerStarted = false;

  constructor(audio: GameAudio, ticker: Ticker) {
    this.audioCtx = audio.audioCtx;
    this.ticker = ticker;

    this.gain = this.audioCtx.createGain();
    this.gain.connect(audio.masterGain);

    this.calcTick = this.calcTick.bind(this);
  }

  startTicker() {
    if (this.isTickerStarted) return;
    // eslint-disable-next-line @typescript-eslint/unbound-method
    this.ticker.add(this.calcTick);
    this.isTickerStarted = true;
  }

  stopTicker() {
    if (!this.isTickerStarted) return;
    // eslint-disable-next-line @typescript-eslint/unbound-method
    this.ticker.remove(this.calcTick);
    this.isTickerStarted = false;
  }

  private calcTick() {
    while(this.playlist.length > 0) {
      const audio = this.playlist.shift()!;
      const buffer = this.audioCtx.createBufferSource();

      buffer.buffer = audio.source;
      buffer.connect(this.gain);
      buffer.start();
    }
  }

  get volume() {
    return this.gain.gain.value;
  }

  set volume(value: number) {
    this.gain.gain.value = value;
  }
}
