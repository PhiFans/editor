import { Ticker } from 'pixi.js';
import { GameAudioClock } from './clock';
import { resumeAudioCtx } from './utils';
import { GameAudioChannel } from './channel';
import { GameAudioClip } from './clip';

const AudioCtx = window.AudioContext;
const GlobalAudioCtx = new AudioCtx({ latencyHint: 'interactive' });
const GlobalAudioTicker = new Ticker();
const GlobalAudioClock = new GameAudioClock(GlobalAudioCtx, GlobalAudioTicker, GlobalAudioCtx.baseLatency);

export class GameAudio {
  readonly audioCtx: AudioContext;
  readonly clock: GameAudioClock;

  readonly masterGain: GainNode;
  readonly channels: {
    music: GameAudioChannel,
    effect: GameAudioChannel,
  };

  constructor() {
    this.audioCtx = GlobalAudioCtx;
    this.clock = GlobalAudioClock;

    this.masterGain = this.audioCtx.createGain();
    this.masterGain.connect(this.audioCtx.destination);
    this.channels = {
      music: new GameAudioChannel(this, GlobalAudioTicker),
      effect: new GameAudioChannel(this, GlobalAudioTicker),
    };
  }

  static from(buffer: AudioBuffer) {
    return new GameAudioClip(GlobalAudioCtx, GlobalAudioClock, buffer);
  }

  get masterVolume() {
    return this.masterGain.gain.value;
  }

  set masterVolume(volume: number) {
    this.masterGain.gain.value = volume;
  }
}

// Automatically resume AudioContext
const resumeAudio = () => resumeAudioCtx(GlobalAudioCtx);
const handleWindowLoaded = () => {
  window.removeEventListener('load', handleWindowLoaded);

  if (GlobalAudioCtx.state === 'running') return;
  window.addEventListener('pointerdown', resumeAudio);
  window.addEventListener('pointerover', resumeAudio);
  window.addEventListener('pointerleave', resumeAudio);
};

GlobalAudioCtx.addEventListener('statechange', () => {
  if (GlobalAudioCtx.state !== 'running') return;

  console.info('[Audio]', 'Resume audio success');
  window.removeEventListener('pointerdown', resumeAudio);
  window.removeEventListener('pointerover', resumeAudio);
  window.removeEventListener('pointerleave', resumeAudio);
});
window.addEventListener('load', handleWindowLoaded);
