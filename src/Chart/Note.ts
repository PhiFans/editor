import { v4 as uuid } from 'uuid';
import ChartJudgeline from './Judgeline';
import { BeatArrayToNumber } from '@/utils/math';
import { NoteType } from './types';
import { BeatArray, RendererSize } from '@/utils/types';
import { Sprite, Container, Texture } from 'pixi.js';

const getNoteTexture = (type: NoteType) => {
  if (type === NoteType.DRAG) return 'note-drag';
  else if (type === NoteType.FLICK) return 'note-flick';
  else return 'note-tap';
};

export type ChartNoteProps = {
  line: ChartJudgeline,
  type: NoteType,
  beat: BeatArray,
  positionX: number,
  speed: number,
  isAbove: boolean,

  holdEndBeat?: BeatArray
};

export default class ChartNote {
  /** Internal property */
  readonly id: string;

  line: ChartJudgeline;
  type: NoteType;
  beat: BeatArray;
  positionX: number;
  speed: number;
  isAbove: boolean;

  holdEndBeat: BeatArray;

  beatNum: number;
  time: number;
  holdEndBeatNum!: number;
  holdEndTime: number;
  holdLengthBeatNum!: number;
  holdLengthTime!: number;

  floorPosition: number;
  holdLength!: number;
  holdEndPosition!: number;

  sprite?: Sprite | Container;

  _realLinePosX: number = 0;
  _realLinePosY: number = 0;
  _realPosX: number = 0;
  _realPosY: number = 0;

  constructor({
    line,
    type,
    beat,
    positionX,
    speed,
    isAbove,

    holdEndBeat
  }: ChartNoteProps, id = uuid()) {
    this.id = id;

    this.line = line;
    this.type = type;
    this.beat = beat;
    this.positionX = positionX;
    this.speed = speed;
    this.isAbove = isAbove;

    this.beatNum = BeatArrayToNumber(this.beat);
    this.holdEndBeat = this.type === NoteType.HOLD && holdEndBeat ? holdEndBeat : this.beat;

    // TODO: Auto-generating these
    this.time = 0;
    this.holdEndTime = 0;
    this.floorPosition = 0;
    this.holdEndPosition = 0;

    this.updateHoldProps();
    this.createSprite();
  }

  updateHoldProps() {
    this.holdEndBeatNum = this.type === NoteType.HOLD ? BeatArrayToNumber(this.holdEndBeat) : this.beatNum;
    if (this.holdEndBeatNum < this.beatNum) {
      this.holdEndBeat = this.beat;
      this.holdEndBeatNum = this.beatNum;
    }

    this.holdLengthBeatNum = this.type === NoteType.HOLD ? this.holdEndBeatNum - this.beatNum : 0;
    this.holdLengthTime = this.type === NoteType.HOLD ? this.holdEndTime - this.time : 0;
    this.holdLength = this.type === NoteType.HOLD ? this.holdEndPosition - this.floorPosition : 0;
  }

  createSprite(container?: Container) {
    if (this.sprite) {
      if (this.sprite.parent) this.sprite.parent.removeChild(this.sprite);
      this.sprite.destroy();
      this.sprite = (void 0);
    }

    if (this.type !== NoteType.HOLD) this.sprite = this.createSpriteNonHold();
    else this.sprite = this.createSpriteHold();

    if (container) container.addChild(this.sprite);
    return this.sprite;
  }

  resize(size: RendererSize) {
    if (!this.sprite) return;

    if (this.type === NoteType.HOLD) {
      const holdLength = this.holdLength * this.speed * size.noteSpeed / size.noteScale;
      this.sprite.children[1].height = holdLength;
      this.sprite.children[2].position.y = -holdLength;
    }

    this.sprite.scale.set(size.noteScale);
  }

  private createSpriteNonHold() {
    const sprite = new Sprite(Texture.from(getNoteTexture(this.type)));
    sprite.anchor.set(0.5);
    return sprite;
  }

  private createSpriteHold() {
    const container = new Container();
    const holdHead = new Sprite(Texture.from('note-hold-head'));
    const holdBody = new Sprite(Texture.from('note-hold-body'));
    const holdEnd = new Sprite(Texture.from('note-hold-end'));

    holdHead.anchor.set(0.5, 0);
    holdBody.anchor.set(0.5, 1);
    holdEnd.anchor.set(0.5, 1);

    container.addChild(
      holdHead,
      holdBody,
      holdEnd
    );
    return container;
  }
}
