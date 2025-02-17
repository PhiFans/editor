import ChartKeyframe, { ChartKeyframeExported } from './Keyframe';

export type TChartJudgelineProps = {
  speed: ChartKeyframe[],
  positionX: ChartKeyframe[],
  positionY: ChartKeyframe[],
  alpha: ChartKeyframe[],
  rotate: ChartKeyframe[],
};

export type ChartJudgelinePropsExported = {
  speed: ChartKeyframeExported[],
  positionX: ChartKeyframeExported[],
  positionY: ChartKeyframeExported[],
  rotate: ChartKeyframeExported[],
  alpha: ChartKeyframeExported[],
};

export default class ChartJudgelineProps implements TChartJudgelineProps {
  speed: ChartKeyframe[] = [];
  /**
   * Center: half of the screen width
   * Unit: Percent
   * Value: half of the screen width
   */
  positionX: ChartKeyframe[] = [];
  /**
   * Center: half of the screen height
   * Unit: Percent
   * Value: half of the screen height
   */
  positionY: ChartKeyframe[] = [];
  /**
   * Range: 0-255
   */
  alpha: ChartKeyframe[] = [];
  /**
   * Unit: Angle
   */
  rotate: ChartKeyframe[] = [];

  constructor(addDefaultKeyframes = true) {
    if (addDefaultKeyframes) {
      this.speed.push(new ChartKeyframe('speed', [ 0, 0, 1 ], 1, false, 0));
      this.positionX.push(new ChartKeyframe('positionX', [ 0, 0, 1 ], 0, false, 0));
      this.positionY.push(new ChartKeyframe('positionY', [ 0, 0, 1 ], 0, false, 0));
      this.alpha.push(new ChartKeyframe('alpha', [ 0, 0, 1 ], 255, false, 0));
      this.rotate.push(new ChartKeyframe('rotate', [ 0, 0, 1 ], 0, false, 0));
    }
  }

  get json(): ChartJudgelinePropsExported {
    return {
      speed: this.speed.map((e) => e.json),
      positionX: this.positionX.map((e) => e.json),
      positionY: this.positionY.map((e) => e.json),
      rotate: this.rotate.map((e) => e.json),
      alpha: this.alpha.map((e) => e.json),
    };
  }
}
