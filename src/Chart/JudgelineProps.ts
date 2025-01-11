import ChartKeyframe from './Keyframe';

export default class ChartJudgelineProps {
  speed: ChartKeyframe[] = [ new ChartKeyframe([ 0, 0, 1 ], 1, false, 1) ];
  positionX: ChartKeyframe[] = [ new ChartKeyframe([ 0, 0, 1 ], 0, false, 1) ];
  positionY: ChartKeyframe[] = [ new ChartKeyframe([ 0, 0, 1 ], 0, false, 1) ];
  alpha: ChartKeyframe[] = [ new ChartKeyframe([ 0, 0, 1 ], 1, false, 1) ];
  rotate: ChartKeyframe[] = [ new ChartKeyframe([ 0, 0, 1 ], 0, false, 1) ];
}
