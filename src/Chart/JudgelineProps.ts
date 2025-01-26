import ChartKeyframe from './Keyframe';

export type TChartJudgelineProps = {
  speed: ChartKeyframe[],
  positionX: ChartKeyframe[],
  positionY: ChartKeyframe[],
  alpha: ChartKeyframe[],
  rotate: ChartKeyframe[],
};

export default class ChartJudgelineProps implements TChartJudgelineProps {
  speed: ChartKeyframe[] = [ new ChartKeyframe('speed', [ 0, 0, 1 ], 1, false, 0) ];
  /**
   * Center: half of the screen width
   * Unit: Percent
   * Value: half of the screen width
   */
  positionX: ChartKeyframe[] = [ new ChartKeyframe('positionX', [ 0, 0, 1 ], 0, false, 0) ];
  /**
   * Center: half of the screen height
   * Unit: Percent
   * Value: half of the screen height
   */
  positionY: ChartKeyframe[] = [ new ChartKeyframe('positionY', [ 0, 0, 1 ], 0, false, 0) ];
  /**
   * Range: 0-255
   */
  alpha: ChartKeyframe[] = [ new ChartKeyframe('alpha', [ 0, 0, 1 ], 255, false, 0) ];
  /**
   * Unit: Angle
   */
  rotate: ChartKeyframe[] = [ new ChartKeyframe('rotate', [ 0, 0, 1 ], 0, false, 0) ];
}
