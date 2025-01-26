import Chart from './Chart';
import ChartKeyframe from './Keyframe';
import Easings from '@/utils/easings';

const getLinePropValue = (time: number, keyframes: ChartKeyframe[], defaultValue = 0) => {
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

function ChartTick(this: Chart) {
  const {
    rendererSize,
    lines,
    time,
  } = this;

  const {
    widthHalf,
    heightHalf,
  } = rendererSize;
  for (const line of lines) {
    const { props, sprite } = line;

    line._speed = getLinePropValue(time, props.speed, line._speed);
    line._posX = getLinePropValue(time, props.positionX, line._posX);
    line._posY = getLinePropValue(time, props.positionY, line._posY);
    line._rotate = getLinePropValue(time, props.rotate, line._rotate);
    line._alpha = getLinePropValue(time, props.alpha, line._alpha);

    line._realPosX = line._posX / 100 * widthHalf;
    line._realPosY = line._posY / -100 * heightHalf;

    sprite.position.set(line._realPosX, line._realPosY);
    sprite.angle = line._rotate;
    sprite.alpha = line._alpha / 255;
  }
}

export default ChartTick;
