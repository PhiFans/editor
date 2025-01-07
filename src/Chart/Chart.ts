import Emitter from 'component-emitter';
import Audio from '@/Audio/Audio';
import AudioClip from '@/Audio/Clip';
import ChartBPM from './BPM';
import ChartJudgeline from './Judgeline';
import ChartNote from './Note';
import { ChartInfo } from './types';

export default class Chart {
  info: ChartInfo;
  offset: number = 0;
  audio: File;
  background: File;

  events = new Emitter();
  bpm: ChartBPM[] = [ new ChartBPM([0, 0, 1], 120) ];
  lines: ChartJudgeline[] = [];
  notes: ChartNote[] = [];

  audioClip!: AudioClip;

  constructor(info: ChartInfo, audio: File, background: File) {
    this.info = info;
    this.audio = audio;
    this.background = background;

    AudioClip.from(audio, Audio.channels.music)
      .then((clip) => {
        this.audioClip = clip;
        this.events.emit('audio-clip-loaded', clip);
      })
      .catch((e) => { throw e });
  }

  async play() {
    await this.waitAudio();
    this.audioClip.play();
  }

  async pause() {
    await this.waitAudio();
    this.audioClip.pause();
  }

  async stop() {
    await this.waitAudio();
    this.audioClip.stop();
  }

  async seek(seconds: number) {
    await this.waitAudio();
    this.audioClip.seek(seconds);
  }

  addLine() {
    const newLine = new ChartJudgeline();
    this.lines.push(newLine);
    this.events.emit('line-list-update', this.lines);
    return newLine;
  }

  get time() {
    return this.audioClip ? this.audioClip.time : 0;
  }

  get duration() {
    return this.audioClip ? this.audioClip.duration : 0;
  }

  private waitAudio() {return new Promise((res) => {
    if (this.audioClip) return res(this.audioClip);
    const clockId = setInterval(() => {
      if (!this.audioClip) return;
      res(this.audioClip);
      clearInterval(clockId);
    }, 200);
  })}
}
