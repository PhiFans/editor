import { ChartExported } from '@/Chart/Chart';
import AudioClip from '@/Audio/Clip';

export type Nullable<T> = T | null;

export type BeatArray = [ number, number, number ];

export type Point = {
  x: number,
  y: number,
};

export type RendererSize = {
  width: number,
  height: number,
  widthHalf: number,
  heightHalf: number,
  /** The real width of the screen */
  widthReal: number,
  /** The real half width of the screen */
  widthRealHalf: number,
  /** `widthRealHalf - widthHalf` */
  widthOffset: number,
  widthPercent: number,
  /** Used for culling notes */
  widthHalfBorder: number,
  /** Used for culling notes */
  heightHalfBorder: number,

  noteScale: number,
  noteWidth: number,
  noteSpeed: number,

  hitParticleScale: number,

  lineScale: number,
  heightPercent: number,
};

/* ==================== Files ==================== */
export interface IFileBasic {
  type: string,
  data: unknown,
}

export interface IFileChart extends IFileBasic {
  type: 'chart',
  data: ChartExported,
}

export interface IFileImage extends IFileBasic {
  type: 'image',
  data: ImageBitmap,
}

export interface IFileAudio extends IFileBasic {
  type: 'audio',
  data: AudioClip,
}

export type IFile = IFileChart | IFileImage | IFileAudio;

export type TChartInfo = {
  name: string,
  artist: string,
  designer: string,
  level: string,
  illustrator: string,

  // Files
  chart: string,
  audio: string,
  image?: string,
  extraFiles: string[],
};

export type TChartInfoCSV = {
  Name: string,
  Designer: string,
  Level: string,
  Illustrator: string,

  Chart: string,
  Music: string,
  Image: string,
}

export type TChartInfoTXT = {
  Name: string,
  Charter: string,
  Level: string,
  Composer: string,

  Song: string,
  Picture: string,
  Chart: string,
};
