import { Nullable } from '@/utils/types';
import { GameAudioChannel } from './channel';
import { GameAudioClock } from './clock';

export enum EGameAudioClipStatus {
  STOP = 0,
  PLAY = 1,
  PAUSE = 2,
}

export class GameAudioClip {
  readonly source: AudioBuffer;
  readonly duration: number;

  private channel: Nullable<GameAudioChannel> = null;
  private buffer?: AudioBufferSourceNode;
  private readonly audioCtx: AudioContext;
  readonly clock: GameAudioClock;

  status: EGameAudioClipStatus = EGameAudioClipStatus.STOP;
  startTime: number = NaN;
  pauseTime: number = NaN;

  constructor(audioCtx: AudioContext, clock: GameAudioClock, audioBuffer: AudioBuffer, channel: Nullable<GameAudioChannel> = null) {
    this.source = audioBuffer;
    this.duration = this.source.duration * 1000;
    this.channel = channel;

    this.audioCtx = audioCtx;
    this.clock = clock;
  }

  setChannel(channel: GameAudioChannel) {
    this.channel = channel;
  }

  unsetChannel() {
    this.channel = null;
  }

  play() {
    if (!this.channel) throw new Error('Cannot play a clip directly without any channel');
    if (this.status === EGameAudioClipStatus.PLAY) return;

    this.buffer = this.audioCtx.createBufferSource();
    this.buffer.buffer = this.source;
    this.buffer.connect(this.channel.gain);

    if (isNaN(this.pauseTime)) {
      this.startTime = this.clock.time;
      this.buffer.start(0, 0);
    } else {
      const pausedTime = this.pauseTime - this.startTime;
      this.startTime = this.clock.time - pausedTime;
      this.buffer.start(0, pausedTime / 1000);
    }

    this.pauseTime = NaN;
    this.status = EGameAudioClipStatus.PLAY;
    this.buffer.onended = () => this.stop();
  }

  pause() {
    if (this.status !== EGameAudioClipStatus.PLAY) return;

    this.disconnectBuffer();
    this.pauseTime = this.clock.time;
    this.status = EGameAudioClipStatus.PAUSE;
  }

  stop() {
    if (this.status === EGameAudioClipStatus.STOP) return;

    this.disconnectBuffer();
    this.startTime = NaN;
    this.pauseTime = NaN;
    this.status = EGameAudioClipStatus.STOP;
  }

  /**
   *
   * @param {number} time Seek seconds
   */
  seek(time: number) {
    if (this.status === EGameAudioClipStatus.STOP) return;

    const isPlayingBefore = this.status === EGameAudioClipStatus.PLAY;
    this.pause();
    this.startTime = this.pauseTime - (time * 1000);

    if (this.startTime > this.pauseTime) this.startTime = this.pauseTime;
    if (isPlayingBefore) this.play();
  }

  destroy() {
    if (!this.channel) return;
    this.stop();
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
