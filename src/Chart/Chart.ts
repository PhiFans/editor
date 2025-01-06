import Emitter from 'component-emitter';
import Audio from '@/Audio/Audio';
import AudioClip from '@/Audio/Clip';
import ChartBPM from './BPM';
import ChartJudgeline from './Judgeline';
import ChartNote from './Note';
import { ChartInfo } from './types';

export default class Chart {
  info: ChartInfo;
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
}
