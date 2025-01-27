import Easings from './easings';
import ChartKeyframe from '@/Chart/Keyframe';

export const getLinePropValue = (time: number, keyframes: ChartKeyframe[], defaultValue = 0) => {
  const { length } = keyframes;
  let lastKeyframeValue = defaultValue;

  for (let i = 0; i < length; i++) {
    const keyframe = keyframes[i];
    if (time === keyframe.time) return keyframe.value;

    const { nextKeyframe } = keyframe;
    if (keyframe.time > time) {
      if (i === 0) break;
      return keyframes[i - 1].value;
    }
    if (keyframe.time < time) {
      if (!nextKeyframe || nextKeyframe.time <= time) {
        lastKeyframeValue = keyframe.value;
        continue;
      }

      const timePercentEnd = Easings[nextKeyframe.easing](
        (time - keyframe.time) / (nextKeyframe.time - keyframe.time)
      );
      return keyframe.value * (1 - timePercentEnd) + nextKeyframe.value * timePercentEnd;
    }
  }

  return lastKeyframeValue;
};
