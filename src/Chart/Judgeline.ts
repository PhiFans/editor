import ChartKeyframe from './Keyframe';
import ChartNote from './Note';

class JudgelineProps {
  speed: ChartKeyframe[] = [];
  positionX: ChartKeyframe[] = [];
  positionY: ChartKeyframe[] = [];
  alpha: ChartKeyframe[] = [];
  rotate: ChartKeyframe[] = [];
}

export default class ChartJudgeline {
  props = new JudgelineProps();
  notes: ChartNote[] = [];
}
