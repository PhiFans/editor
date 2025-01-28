import { v4 as uuid } from 'uuid';
import App from '@/App/App';
import Audio from '@/Audio/Audio';
import AudioClip, { EAudioClipStatus } from '@/Audio/Clip';
import ChartBPMList from './BPMList';
import ChartJudgeline from './Judgeline';
import ChartNote from './Note';
import ChartTick from './Tick';
import { ChartBookmark, ChartInfo } from './types';
import { BeatArray, RendererSize } from '@/utils/types';
import { Container } from 'pixi.js';
import { CalculateRendererSize } from '@/utils/renderer';

export default class Chart {
  info: ChartInfo;
  offset: number = 0;
  audio: File;
  background: File;

  bpm: ChartBPMList = new ChartBPMList();
  lines: ChartJudgeline[] = [];
  notes: ChartNote[] = [];
  bookmarks: ChartBookmark[] = [];

  container = new Container();
  audioClip!: AudioClip;
  rendererSize = CalculateRendererSize(1, 1);
  tick: () => void;

  constructor(info: ChartInfo, audio: File, background: File) {
    this.info = info;
    this.audio = audio;
    this.background = background;

    // Init
    this.tick = ChartTick.bind(this);
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
    const newLine = new ChartJudgeline(this);
    this.lines.push(newLine);
    this.container.addChild(newLine.sprite);

    App.events.emit('chart.lines.added', newLine);
    App.events.emit('chart.lines.updated', this.lines);

    return newLine;
  }

  removeLine(id: string) {
    const lineIndex = this.lines.findIndex((e) => e.id === id);
    if (lineIndex === -1) return;

    const line = this.lines[lineIndex];
    line.destroy();
    this.lines.splice(lineIndex, 1);

    App.events.emit('chart.lines.removed', line);
    App.events.emit('chart.lines.updated', [ ...this.lines ]);
  }

  addBookmark(beatNum: number, label: string, color?: string, id = uuid()) {
    this.bookmarks.push({
      id,
      beatNum,
      label,
      color: color || null,
    });
  }

  removeBookmark(id: string) {
    const bookmarkId = this.bookmarks.findIndex((e) => e.id === id);
    if (bookmarkId === -1) return;
    this.bookmarks.splice(bookmarkId, 1);
  }

  addBPM(time: BeatArray, bpm: number) {
    this.bpm.add(time, bpm);
    this.updateLinesTime();
    App.events.emit('chart.bpms.updated', [ ...this.bpm ]);
  }

  editBPM(id: string, newBeat?: BeatArray, newBPM?: number) {
    this.bpm.edit(id, newBPM, newBeat);
    this.updateLinesTime();
    App.events.emit('chart.bpms.updated', [ ...this.bpm ]);
  }

  removeBPM(id: string) {
    this.bpm.remove(id);
    this.updateLinesTime();
    App.events.emit('chart.bpms.updated', [ ...this.bpm ]);
  }

  resize(size: RendererSize) {
    this.rendererSize = size;

    this.container.position.set(
      size.widthRealHalf,
      size.heightHalf
    );

    for (const line of this.lines) {
      line.resize(size);
    }
  }

  private updateLinesTime() {
    for (const line of this.lines) {
      line.updateProp('speed', true);
      line.updateProp('positionX', true);
      line.updateProp('positionY', true);
      line.updateProp('rotate', true);
      line.updateProp('alpha', true);

      line.calcFloorPositions();
      for (const note of line.notes) {
        line.calcNoteTime(note);
      }
    }
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
