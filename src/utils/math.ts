import { BeatArray } from './types';

export const FillZero = (number: number, length = 2) => {
  let result = `${number}`;
  while (result.length < length) {
    result = `0${result}`;
  }
  return result;
};

export const BeatArrayToNumber = (array: BeatArray) => parseDoublePrecist(array[0] + array[1] / array[2], 6, -1);

/**
 *
 * @param {number} mode 1 == Ceil, 0 == Round, -1 == Floor. Default: round.
 */
export const parseDoublePrecist = (double: number, precision: number = 0, mode: (-1 | 0 | 1) = 0) => {
  if (mode === 1) return Math.ceil(double * (10 ** precision)) / (10 ** precision);
  else if (mode === -1) return Math.floor(double * (10 ** precision)) / (10 ** precision);
  else return Math.round(double * (10 ** precision)) / (10 ** precision);
};
