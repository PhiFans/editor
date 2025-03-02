import { Nullable } from '@/utils/types';

export type ChartInfo = {
  name: string,
  artist: string,
  illustration: string,
  level: string,
  designer: string,
};

export type ChartInfoWithFile = ChartInfo & {
  music: Blob,
  background: Blob,
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
