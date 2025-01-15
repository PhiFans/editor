import { BeatArrayToNumber } from '@/utils/math';
import { BeatArray, Nullable } from '@/utils/types';

export type TChartKeyframe = {
  beat: BeatArray;
  beatNum: number;
  value: number;
  continuous: boolean;
  easing: number;
};

export default class ChartKeyframe implements TChartKeyframe {
  beat: BeatArray;
  beatNum: number;
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
    if (BeatArrayToNumber(beat) < 0) throw new Error('Cannot set a negative beat to keyframe!');

    this.beat = beat;
    this.beatNum = BeatArrayToNumber(this.beat);
    this.value = value;
    this.continuous = continuous;
    this.easing = easing;

    // TODO: Auto-generating these
    this.time = NaN;
  }
}
