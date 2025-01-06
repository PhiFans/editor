import { Ticker } from 'pixi.js';
import AudioClock from './Clock';
import AudioChannel from './Channel';
import AudioClip from './Clip';
import { resumeAudioCtx } from './utils';

const AudioCtx = window.AudioContext;
const GlobalAudioCtx = new AudioCtx({ latencyHint: 'interactive' });
const GlobalAudioTicker = new Ticker();
const GlobalAudioClock = new AudioClock(GlobalAudioCtx, GlobalAudioTicker, GlobalAudioCtx.baseLatency);

export class Audio {
  readonly audioCtx: AudioContext;
  readonly clock: AudioClock;

  readonly masterGain: GainNode;
  readonly channels: {
    music: AudioChannel,
    effect: AudioChannel,
  };

  constructor() {
    this.audioCtx = GlobalAudioCtx;
    this.clock = GlobalAudioClock;

    this.masterGain = this.audioCtx.createGain();
    this.masterGain.connect(this.audioCtx.destination);
    this.channels = {
      music: new AudioChannel(this, GlobalAudioTicker),
      effect: new AudioChannel(this, GlobalAudioTicker),
    };
  }

  static from(buffer: AudioBuffer) {
    return new AudioClip(GlobalAudioCtx, GlobalAudioClock, buffer);
  }

  get masterVolume() {
    return this.masterGain.gain.value;
  }

  set masterVolume(volume: number) {
    this.masterGain.gain.value = volume;
  }
}

const audio = new Audio();
export default audio;

// Automatically resume AudioContext
const _resumeAudio = () => {
  resumeAudioCtx(GlobalAudioCtx).catch(() => void 0);
};
const handleWindowLoaded = () => {
  window.removeEventListener('load', handleWindowLoaded);

  if (GlobalAudioCtx.state === 'running') return;
  window.addEventListener('pointerdown', _resumeAudio);
  window.addEventListener('pointerover', _resumeAudio);
  window.addEventListener('pointerleave', _resumeAudio);
};

GlobalAudioCtx.addEventListener('statechange', () => {
  if (GlobalAudioCtx.state !== 'running') return;

  console.info('[Audio]', 'Resume audio success');
  window.removeEventListener('pointerdown', _resumeAudio);
  window.removeEventListener('pointerover', _resumeAudio);
  window.removeEventListener('pointerleave', _resumeAudio);
});
window.addEventListener('load', handleWindowLoaded);
