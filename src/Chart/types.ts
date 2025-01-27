
export type ChartInfo = {
  name: string,
  artist: string,
  illustration: string,
  level: string,
  designer: string,
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
