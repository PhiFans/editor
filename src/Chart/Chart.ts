import { Container, Sprite, Texture, Ticker } from 'pixi.js';
import { EventEmitter } from 'eventemitter3';
import { v4 as uuid } from 'uuid';
import Audio from '@/Audio/Audio';
import AudioClip, { EAudioClipStatus } from '@/Audio/Clip';
import Database from '@/Database/Database';
import StorageFile from '@/Storage/File';
import ChartBPMList from './BPMList';
import ChartJudgeline, { ChartJudgelineExported } from './Judgeline';
import ChartNote from './Note';
import ChartTick from './Tick';
import { ChartBookmark, ChartInfo, ChartInfoWithFile } from './types';
import { BeatArray, Nullable, RendererSize } from '@/utils/types';
import { CalculateRendererSize } from '@/utils/renderer';
import { ChartBPMExported } from './BPM';
import ChartHistory from './History/History';
import { TChartJudgelineProps } from './JudgelineProps';
import { ChartKeyframeExported } from './Keyframe';
import { TProject } from '@/Database/types';
import { ReadFileAsText } from '@/utils/file';
import { TStorageFile } from '@/Storage/types';

type $ChartInfo = ChartInfoWithFile & {
  id: string,
};

export type ChartExported = {
  info: ChartInfo,
  offset: number,
  bpm: ChartBPMExported[],
  lines: ChartJudgelineExported[],
};

class Chart {
  // Chart data
  bpm: ChartBPMList = new ChartBPMList();
  lines: ChartJudgeline[] = [];
  notes: ChartNote[] = [];

  _offset: number = 0;
  offsetBeat: number = 0;

  bookmarks: ChartBookmark[] = [];
  histories: ChartHistory = new ChartHistory(this);

  rendererSize = CalculateRendererSize(1, 1);
  readonly container = new Container();

  readonly events = new EventEmitter();
  readonly ticker: Ticker;
  readonly tick = ChartTick.bind(this);

  // Resources
  private _info: Nullable<$ChartInfo> = null;
  private _id: Nullable<string> = null;
  private _music: Nullable<AudioClip> = null;
  private _background: Nullable<Sprite> = null;

  constructor() {
    // Init ticker
    this.ticker = new Ticker();
    this.ticker.stop();
    this.ticker.add(this.tick);
  }

  create(infoWithFile: ChartInfoWithFile) {
    if (this._info !== null) return;

    this._info = {
      ...infoWithFile,
      id: uuid(),
    };
    this._id = null;

    this.addBPM([ 0, 0, 1 ], 120, false, false);
    this.addLine(true, false);

    this.loadFiles();
    this.events.emit('loaded', this);
  }

  load(infoWithFile: ChartInfoWithFile, chartJson: ChartExported, projectID = uuid(), chartID = uuid()) {
    if (this._info !== null) return;

    const addKeyframesToLine = (line: ChartJudgeline, type: keyof TChartJudgelineProps, keyframes: ChartKeyframeExported[]) => {
      for (const keyframe of keyframes) {
        line.addKeyframe(type, keyframe.beat, keyframe.value, keyframe.continuous, keyframe.easing);
      }
    };

    this._info = {
      ...infoWithFile,
      id: projectID,
    };
    this._id = chartID;
    this._offset = chartJson.offset / 1000;

    for (const bpm of chartJson.bpm) {
      this.addBPM(bpm.beat, bpm.bpm, false, false);
    }

    for (const line of chartJson.lines) {
      const newLine = this.addLine(false, false)!;

      for (const _name in line.props) {
        const name = _name as keyof TChartJudgelineProps;
        addKeyframesToLine(newLine, name, line.props[name]);
        newLine.updateProp(name, true);
      }

      newLine.calcFloorPositions();

      for (const note of line.notes) {
        newLine.addNote({
          ...note
        });
      }
    }

    this.loadFiles();
    this.events.emit('loaded', this);
  }

  saveToDatabase(): Promise<Nullable<TProject>> {return new Promise(async (res) => {
    if (!this._info) return res(null);
    
    const oldProject = await Database.project.get(this._info.id);
    if (oldProject) {
      const projectInfo: ChartInfo & Partial<$ChartInfo> & Partial<TProject> = {
        ...oldProject,
        ...this._info,
      };

      delete projectInfo.music;
      delete projectInfo.background;

      await StorageFile.update(this._id!, new Blob([ JSON.stringify(this.json) ]));
      await Database.project.update(projectInfo.id!, projectInfo as TProject);

      return res(projectInfo as TProject);
    } else {
      const { id: musicID } = await StorageFile.add(this._info.music);
      const { id: backgroundID } = await StorageFile.add(this._info.background);
      const { id: chartID } = await StorageFile.add(new Blob([ JSON.stringify(this.json) ]));

      this._id = chartID;

      const projectInfo: ChartInfo & Partial<$ChartInfo> & Partial<TProject> = { ...this._info };

      delete projectInfo.music;
      delete projectInfo.background;

      projectInfo.chartID = chartID;
      projectInfo.musicID = musicID;
      projectInfo.backgroundID = backgroundID;
      projectInfo.filesID = uuid(); // TODO

      await Database.project.add(projectInfo as TProject);
      return res(projectInfo as TProject);
    }
  })}

  clear() {
    if (!this._info) return;

    this.ticker.stop();

    this._music?.destroy();
    this._background?.destroy();

    this._music = null;
    this._background = null;
    this._info = null;
    this._id = null;

    this.bpm.length = 0;
    this.lines.length = 0;

    this.events.emit('clear', null);
  }

  loadFromDatabase(projectID: string) {return new Promise(async (res, rej) => {
    if (this._info !== null) return res(null);

    const projectMeta = await Database.project.get(projectID);
    if (!projectMeta) return rej(`No project found: ${projectID}`);

    const musicFile = await StorageFile.get(projectMeta.musicID) as Nullable<TStorageFile>;
    if (!musicFile) return rej(`No file found: ${projectMeta.musicID}`);

    const backgroundFile = await StorageFile.get(projectMeta.backgroundID) as Nullable<TStorageFile>;
    if (!backgroundFile) return rej(`No file found: ${projectMeta.backgroundID}`);

    const chartFile = await StorageFile.get(projectMeta.chartID) as Nullable<TStorageFile>;
    if (!chartFile) return rej(`No file found: ${projectMeta.chartID}`);

    // TODO: Extra files

    const chartText = await ReadFileAsText(chartFile.blob);
    const chartJson = JSON.parse(chartText) as ChartExported;

    this.load({
      name: projectMeta.name,
      artist: projectMeta.artist,
      illustration: projectMeta.illustration,
      level: projectMeta.level,
      designer: projectMeta.designer,
      music: musicFile.blob,
      background: backgroundFile.blob,
    }, chartJson, projectMeta.id, projectMeta.chartID);
    res(this);
  })}

  async play() {
    if (!this._info) return;
    await this.waitAudio();
    this._music!.play();
  }

  async pause() {
    if (!this._info) return;
    await this.waitAudio();
    this._music!.pause();
  }

  async playOrPause() {
    if (!this._info) return;
    await this.waitAudio();
    if (this._music!.status === EAudioClipStatus.PLAY) this._music!.pause();
    else this._music!.play();
  }

  async stop() {
    if (!this._info) return;
    await this.waitAudio();
    this._music!.stop();
  }

  addLine(addDefaultKeyframes = true, addToHistory = true) {
    if (!this._info) return;
    const newLine = new ChartJudgeline(this, addDefaultKeyframes);
    this.lines.push(newLine);
    this.container.addChild(newLine.sprite);
    if (addToHistory) this.histories.add({
      name: 'line',
      action: 'add',
      id: newLine.id,
      after: newLine.json,
    });

    this.events.emit('lines.added', newLine);
    this.events.emit('lines.updated', this.lines);

    return newLine;
  }

  removeLine(id: string, emit = true, addToHistory = true) {
    if (!this._info) return;
    const lineIndex = this.lines.findIndex((e) => e.id === id);
    if (lineIndex === -1) return;

    const line = this.lines[lineIndex];
    line.destroy();
    this.lines.splice(lineIndex, 1);
    if (addToHistory) this.histories.add({
      name: 'line',
      action: 'delete',
      id: line.id,
      before: line.json,
    });

    if (emit) {
      this.events.emit('lines.removed', line);
      this.events.emit('lines.updated', [ ...this.lines ]);
    }
  }

  addBPM(time: BeatArray, bpm: number, emit = true, addToHistory = true) {
    if (!this._info) return;
    const newBPM = this.bpm.add(time, bpm);
    if (addToHistory) this.histories.add({
      name: 'bpm',
      action: 'add',
      id: newBPM.id,
      after: newBPM.json,
    });

    this.updateLinesTime();
    this.updateOffsetBeat();
    if (emit) this.events.emit('bpms.updated', [ ...this.bpm ]);
  }

  editBPM(id: string, newBeat?: BeatArray, newBPM?: number, emit = true) {
    if (!this._info) return;
    this.bpm.edit(id, newBPM, newBeat);
    this.updateLinesTime();
    this.updateOffsetBeat();
    if (emit) this.events.emit('bpms.updated', [ ...this.bpm ]);
  }

  removeBPM(id: string, emit = true, addToHistory = true) {
    if (!this._info) return;
    const oldBPM = this.bpm.remove(id);
    if (!oldBPM) return;
    if (addToHistory) this.histories.add({
      name: 'bpm',
      action: 'delete',
      id: oldBPM.id,
      before: oldBPM.json,
    })

    this.updateLinesTime();
    this.updateOffsetBeat();
    if (emit) this.events.emit('bpms.updated', [ ...this.bpm ]);
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

  updateOffsetBeat() {
    if (!this._info) return;
    if (this.bpm.length <= 0) return;

    const offsetBeat = this.bpm.timeToBeatNum(this._offset);
    if (this.offsetBeat === offsetBeat) return;

    this.offsetBeat = offsetBeat;
    this.events.emit('offset.updated', { offset: this.offset, offsetBeat: offsetBeat });
  }

  get info(): Nullable<ChartInfo> {
    if (!this._info) return null;

    const chartInfo: Partial<ChartInfoWithFile> & ChartInfo = { ...this._info };

    delete chartInfo.music;
    delete chartInfo.background;

    return chartInfo;
  }

  get files() {
    if (!this._info) return null;

    return {
      music: this._info.music,
      background: this._info.background,
      chart: new Blob([ JSON.stringify(this.json) ]),
    };
  }

  get json(): Nullable<ChartExported> {
    if (this._info === null) return null;

    return {
      info: this.info!,
      offset: this.offset,
      bpm: this.bpm.json,
      lines: this.lines.map((e) => e.json),
    };
  }

  get status() {
    if (!this._info) return EAudioClipStatus.STOP;
    return this._music ? this._music.status : EAudioClipStatus.STOP;
  }

  get time() {
    if (!this._info) return 0;
    return this._music ? this._music.time : 0;
  }

  set time(time: number) {
    if (!this._info) return;
    this.waitAudio()
      .then(() => this._music!.seek(time))
      .catch(() => void 0);
  }

  get duration() {
    if (!this._info) return 0;
    return this._music ? this._music.duration : 0;
  }

  get beatNum() {
    if (!this._info) return 0;
    return this.bpm.timeToBeatNum(this.time);
  }

  set beatNum(beatNum: number) {
    if (!this._info) return;
    this.waitAudio()
      .then(() => this._music!.seek(this.bpm.getRealTime(beatNum)))
      .catch(() => void 0);
  }

  get beatDuration() {
    if (!this._info) return 0;
    return this.bpm.timeToBeatNum(this.duration);
  }

  get offset() {
    if (!this._info) return 0;
    return this._offset * 1000;
  }

  set offset(offset: number) {
    const _offset = offset / 1000;
    this._offset = _offset;

    this.updateOffsetBeat();
    this.waitAudio()
      .then((clip) => {
        clip.timeOffset = _offset;
      })
      .catch(() => void 0);
  }

  private loadFiles() {
    if (!this._info) return;

    AudioClip.from(this._info.music, Audio.channels.music)
      .then((clip) => {
        clip.timeOffset = this._offset;
        this._music = clip;

        this.updateOffsetBeat();
        this.ticker.start();
        this.events.emit('music.loaded', this._music);
      })
      .catch((e) => { throw e });
    
    createImageBitmap(this._info.background)
      .then((bitmap) => {
        this._background = Sprite.from(Texture.from(bitmap));
        this._background.anchor.set(0.5);

        this.events.emit('background.loaded', this._background);
      })
      .catch((e) => { throw e });
  }

  private waitAudio(): Promise<AudioClip> {return new Promise((res) => {
    if (this._music) return res(this._music);
    const clockId = setInterval(() => {
      if (!this._music) return;
      res(this._music);
      clearInterval(clockId);
    }, 200);
  })}

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
}

const chart = new Chart();
console.log(chart);

export default chart;
export { Chart };
