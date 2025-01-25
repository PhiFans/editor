import { RendererSize } from './types';

export const CalculateRendererSize = (width: number, height: number): RendererSize => {
  const result: Partial<RendererSize> = {};

  result.widthReal = width;
  result.height = height;

  result.widthRealHalf = result.widthReal / 2;
  result.heightHalf = result.height / 2;

  // TODO: Ratio settings
  result.width = result.height / 9 * 16 >= result.widthReal ? result.widthReal : result.height / 9 * 16;
  result.widthHalf = result.width / 2;
  result.widthOffset = result.widthReal - result.widthHalf;

  result.widthHalfBorder = result.widthHalf * 1.2;
  result.heightHalfBorder = result.heightHalf * 1.2;

  result.widthPercent = result.width * (9 / 160);

  // TODO: Note size settings
  result.noteScale = result.width / 8080;
  result.noteWidth = result.width * 0.117775;
  result.noteSpeed = result.height;

  result.hitParticleScale = result.noteScale * 6;

  result.lineScale = result.width > result.height * 0.75 ? result.height / 18.75 : result.width / 14.0625;
  result.heightPercent = result.height / 1080;

  return result as RendererSize;
};
