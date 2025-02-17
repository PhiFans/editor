import Chart from './Chart';
import { getLinePropValue } from '@/utils/chart';
import { NoteType } from './types';

function ChartTick(this: Chart) {
  const {
    rendererSize,
    lines,
    time: _time,
    offset,
    container,
  } = this;
  const time = _time - (offset / 1000);

  const {
    widthHalf,
    heightHalf,
    noteSpeed,
    noteScale,
  } = rendererSize;
  for (const line of lines) {
    const { props, floorPositions, sprite, notes } = line;

    line._speed = getLinePropValue(time, props.speed, line._speed);
    line._posX = getLinePropValue(time, props.positionX, line._posX);
    line._posY = getLinePropValue(time, props.positionY, line._posY);
    line._rotate = getLinePropValue(time, props.rotate, line._rotate);
    line._alpha = getLinePropValue(time, props.alpha, line._alpha);

    for (let i = 0, l = floorPositions.length; i < l; i++) {
      const event = floorPositions[i];

      if (event.endTime < time) continue;
      if (event.time > time) break;

      line._fPos = event.value + (time - event.time) * line._speed;
    }

    line._realPosX = line._posX / 100 * widthHalf;
    line._realPosY = line._posY / -100 * heightHalf;

    line._radian = line._rotate * (Math.PI / 180);
    line._cosr = Math.cos(line._radian);
    line._sinr = Math.sin(line._radian);

    sprite.position.set(line._realPosX, line._realPosY);
    sprite.angle = line._rotate;
    sprite.alpha = line._alpha / 255;

    for (const note of notes) {
      const {
        type,
        time: noteTime,
        holdEndTime,
        positionX,
        speed,
        isAbove,
        floorPosition,
        holdLength,
        holdEndPosition,
        sprite,
      } = note;
      if (!sprite) continue;

      if (
        (noteTime <= time) &&
        (type !== NoteType.HOLD || holdEndTime <= time)
      ) {
        if (sprite.parent) sprite.removeFromParent();
        continue;
      }

      const floorPositionDiff = (floorPosition - line._fPos) * speed;
      if (
        floorPositionDiff > 2 ||
        (floorPositionDiff < 0 && noteTime > time)
      ) {
        if (sprite.parent) sprite.removeFromParent();
        continue;
      }

      const posX = widthHalf * positionX / 100;
      const posY = floorPositionDiff * noteSpeed * (isAbove ? -1 : 1);
      const realXSin = posY * line._sinr * -1;
      const realYCos = posY * line._cosr;

      note._realLinePosX = posX * line._cosr + line._realPosX;
      note._realLinePosY = posX * line._sinr + line._realPosY;

      note._realPosX = note._realLinePosX + realXSin;
      note._realPosY = note._realLinePosY + realYCos;

      if (type === NoteType.HOLD) {
        const [ spriteHead, spriteBody, spriteEnd ] = sprite.children;
        let realHoldLength = holdLength * speed * noteSpeed / noteScale;

        spriteHead.visible = true;
        if (noteTime <= time) {
          realHoldLength = (holdEndPosition - line._fPos) * speed * noteSpeed / noteScale;

          note._realPosX -= realXSin;
          note._realPosY -= realYCos;

          spriteHead.visible = false;
        }

        spriteBody.height = realHoldLength;
        spriteEnd.position.y = -realHoldLength;
      }

      sprite.position.set(note._realPosX, note._realPosY);
      sprite.angle = line._rotate + (isAbove ? 0 : 180);
      if (!sprite.parent) container.addChild(sprite);
    }
  }
}

export default ChartTick;
