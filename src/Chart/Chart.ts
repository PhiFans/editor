import App from '@/App/App';
import Audio from '@/Audio/Audio';
import AudioClip, { EAudioClipStatus } from '@/Audio/Clip';
import ChartBPMList from './BPMList';
import ChartJudgeline from './Judgeline';
import ChartNote from './Note';
import { ChartInfo } from './types';
import { BeatArray } from '@/utils/types';

export default class Chart {
  info: ChartInfo;
  offset: number = 0;
  audio: File;
  background: File;

  bpm: ChartBPMList = new ChartBPMList();
  lines: ChartJudgeline[] = [];
  notes: ChartNote[] = [];

  audioClip!: AudioClip;

  constructor(info: ChartInfo, audio: File, background: File) {
    this.info = info;
    this.audio = audio;
    this.background = background;

    // Init
    this.addLine();
    AudioClip.from(audio, Audio.channels.music)
      .then((clip) => {
        this.audioClip = clip;
        App.events.emit('chart.audioClip.loaded', clip);
      })
      .catch((e) => { throw e });

    App.hotkeys.add('space', 'chart.playOrPause');
    App.hotkeys.on('chart.playOrPause', () => this.playOrPause());
  }

  async play() {
    await this.waitAudio();
    this.audioClip.play();
  }

  async pause() {
    await this.waitAudio();
    this.audioClip.pause();
  }

  async playOrPause() {
    await this.waitAudio();
    if (this.audioClip.status === EAudioClipStatus.PLAY) this.audioClip.pause();
    else this.audioClip.play();
  }

  async stop() {
    await this.waitAudio();
    this.audioClip.stop();
  }

  addLine() {
    const newLine = new ChartJudgeline(this.bpm);
    this.lines.push(newLine);

    App.events.emit('chart.lines.added', newLine);
    App.events.emit('chart.lines.updated', this.lines);

    return newLine;
  }

  addBPM(time: BeatArray, bpm: number) {
    this.bpm.add(time, bpm);
    App.events.emit('chart.bpms.updated', [ ...this.bpm ]);
  }

  editBPM(id: string, newBeat?: BeatArray, newBPM?: number) {
    this.bpm.edit(id, newBPM, newBeat);
    App.events.emit('chart.bpms.updated', [ ...this.bpm ]);
  }

  removeBPM(id: string) {
    this.bpm.remove(id);
    App.events.emit('chart.bpms.updated', [ ...this.bpm ]);
  }

  get status() {
    return this.audioClip ? this.audioClip.status : EAudioClipStatus.STOP;
  }

  get time() {
    return this.audioClip ? this.audioClip.time : 0;
  }

  set time(time: number) {
    this.waitAudio()
      .then(() => this.audioClip.seek(time))
      .catch(() => void 0);
  }

  get duration() {
    return this.audioClip ? this.audioClip.duration : 0;
  }

  get beatNum() {
    return this.bpm.timeToBeatNum(this.time);
  }

  set beatNum(beatNum: number) {
    this.waitAudio()
      .then(() => this.audioClip.seek(this.bpm.getRealTime(beatNum)))
      .catch(() => void 0);
  }

  get beatDuration() {
    return this.bpm.timeToBeatNum(this.duration);
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
