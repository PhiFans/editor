
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
