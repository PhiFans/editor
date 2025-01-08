import App from '@/App/App';
import Audio from '@/Audio/Audio';
import AudioClip from '@/Audio/Clip';
import ChartBPM from './BPM';
import ChartJudgeline from './Judgeline';
import ChartNote from './Note';
import { ChartInfo } from './types';
import { ChartNoteProps } from './Note';

export default class Chart {
  info: ChartInfo;
  offset: number = 0;
  audio: File;
  background: File;

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
        App.events.emit('chart.audioClip.loaded', clip);
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

    App.events.emit('chart.lines.added', newLine);
    App.events.emit('chart.lines.updated', this.lines);

    return newLine;
  }

  addNote(line: ChartJudgeline | number, noteProps: Omit<ChartNoteProps, 'line'>) {
    let _line: ChartJudgeline;
    if (typeof line === 'number') _line = this.lines[line];
    else _line = line;
    if (!_line) throw new Error('No such line found');

    const newNote = new ChartNote({ line: _line, ...noteProps });
    _line.notes.push(newNote);
    return newNote;
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
