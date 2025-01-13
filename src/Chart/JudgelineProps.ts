import ChartKeyframe from './Keyframe';

export type TChartJudgelineProps = {
  speed: ChartKeyframe[],
  positionX: ChartKeyframe[],
  positionY: ChartKeyframe[],
  alpha: ChartKeyframe[],
  rotate: ChartKeyframe[],
};

export default class ChartJudgelineProps implements TChartJudgelineProps {
  speed: ChartKeyframe[] = [ new ChartKeyframe([ 0, 0, 1 ], 1, false, 1) ];
  positionX: ChartKeyframe[] = [ new ChartKeyframe([ 0, 0, 1 ], 0, false, 1) ];
  positionY: ChartKeyframe[] = [ new ChartKeyframe([ 0, 0, 1 ], 0, false, 1) ];
  alpha: ChartKeyframe[] = [ new ChartKeyframe([ 0, 0, 1 ], 1, false, 1) ];
  rotate: ChartKeyframe[] = [ new ChartKeyframe([ 0, 0, 1 ], 0, false, 1) ];
}
