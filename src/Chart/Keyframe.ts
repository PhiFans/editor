import { BeatArray, Nullable } from '@/utils/types';

export default class ChartKeyframe {
  beat: BeatArray;
  value: number;
  continuous: boolean;
  easing: number;

  time: number;
  lastKeyframe: Nullable<ChartKeyframe> = null;
  nextKeyframe: Nullable<ChartKeyframe> = null;

  constructor(
    beat: BeatArray,
    value: number,
    continuous: boolean,
    easing: number
  ) {
    this.beat = beat;
    this.value = value;
    this.continuous = continuous;
    this.easing = easing;

    // TODO: Auto-generating these
    this.time = NaN;
  }
}
