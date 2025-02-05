import { BeatArray, Nullable } from '@/utils/types';

export type ChartInfo = {
  name: string,
  artist: string,
  illustration: string,
  level: string,
  designer: string,
};

export type ChartBookmark = {
  id: string;
  beatNum: number;
  label: string;
  color: Nullable<string>;
};

export enum NoteType {
  TAP = 1,
  DRAG = 2,
  HOLD = 3,
  FLICK = 4,
};

export type FloorPosition = {
  time: number,
  endTime: number,
  value: number,
};

export type ChartNote = {
  id: string,
  lineID: string,
  type: NoteType,
  time: BeatArray,
  speed: number,
  isAbove: boolean,
  holdEndTime: BeatArray,
};

export type ChartKeyframe = {
  id: string,
  lineID: string,
  time: BeatArray,
  value: number,
  continuous: boolean,
  easing: number,
};

export type ChartJudglineProps = {
  speed: ChartKeyframe[],
  positionX: ChartKeyframe[],
  positionY: ChartKeyframe[],
  rotate: ChartKeyframe[],
  alpha: ChartKeyframe[],
};

export type ChartJudgeline = {
  id: string,
  props: ChartJudglineProps,
  notes: ChartNote[],
};

export type ChartBPM = {
  id: string,
  time: BeatArray,
  bpm: number,
};

export type Chart = {
  bpms: ChartBPM[],
  lines: ChartJudgeline[],
  notes: ChartNote[],
};
