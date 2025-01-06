import { Nullable } from '@/utils/types';
import AudioChannel from './Channel';
import AudioClock from './Clock';
import Audio from './Audio';
import { ReadFileAsAudioBuffer } from '@/utils/file';

export enum EAudioClipStatus {
  STOP = 0,
  PLAY = 1,
  PAUSE = 2,
}

export default class AudioClip {
  readonly source: AudioBuffer;
  readonly duration: number;

  private _channel: Nullable<AudioChannel> = null;
  private buffer?: AudioBufferSourceNode;
  private readonly audioCtx: AudioContext;
  readonly clock: AudioClock;

  status: EAudioClipStatus = EAudioClipStatus.STOP;
  startTime: number = NaN;
  pauseTime: number = NaN;

  constructor(audioCtx: AudioContext, clock: AudioClock, audioBuffer: AudioBuffer, channel: Nullable<AudioChannel> = null) {
    this.source = audioBuffer;
    this.duration = this.source.duration * 1000;
    this._channel = channel;

    this.audioCtx = audioCtx;
    this.clock = clock;
  }

  static from(file: File): Promise<AudioClip> {return new Promise((res, rej) => {
    ReadFileAsAudioBuffer(file)
      .then((buffer) => res(new AudioClip(Audio.audioCtx, Audio.clock, buffer)))
      .catch((e) => rej(e));
  })}

  play() {
    if (!this._channel) throw new Error('Cannot play a clip directly without any channel');
    if (this.status === EAudioClipStatus.PLAY) return;

    this.buffer = this.audioCtx.createBufferSource();
    this.buffer.buffer = this.source;
    this.buffer.connect(this._channel.gain);

    if (isNaN(this.pauseTime)) {
      this.startTime = this.clock.time;
      this.buffer.start(0, 0);
    } else {
      const pausedTime = this.pauseTime - this.startTime;
      this.startTime = this.clock.time - pausedTime;
      this.buffer.start(0, pausedTime / 1000);
    }

    this.pauseTime = NaN;
    this.status = EAudioClipStatus.PLAY;
    this.buffer.onended = () => this.stop();
  }

  pause() {
    if (this.status !== EAudioClipStatus.PLAY) return;

    this.disconnectBuffer();
    this.pauseTime = this.clock.time;
    this.status = EAudioClipStatus.PAUSE;
  }

  stop() {
    if (this.status === EAudioClipStatus.STOP) return;

    this.disconnectBuffer();
    this.startTime = NaN;
    this.pauseTime = NaN;
    this.status = EAudioClipStatus.STOP;
  }

  /**
   *
   * @param {number} time Seek seconds
   */
  seek(time: number) {
    if (this.status === EAudioClipStatus.STOP) return;

    const isPlayingBefore = this.status === EAudioClipStatus.PLAY;
    this.pause();
    this.startTime = this.pauseTime - (time * 1000);

    if (this.startTime > this.pauseTime) this.startTime = this.pauseTime;
    if (isPlayingBefore) this.play();
  }

  destroy() {
    if (!this._channel) return;
    this.stop();
  }

  get channel() {
    return this._channel;
  }

  set channel(channel: Nullable<AudioChannel>) {
    this._channel = channel;
  }

  get speed() {
    return this.buffer ? this.buffer.playbackRate.value : 1;
  }

  set speed(value: number) {
    if (this.buffer) this.buffer.playbackRate.value = value;
  }

  private disconnectBuffer() {
    if (!this.buffer) return;

    this.buffer.stop();
    this.buffer.disconnect();
    this.buffer.onended = null;
    this.buffer = (void 0);
  }
}
