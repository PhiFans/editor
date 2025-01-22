import React, { useMemo } from "react";
import { extend } from "@pixi/react";
import { Container, Sprite, Texture } from 'pixi.js';
import { useClockTime } from "@/ui/contexts/Clock";
import { parseDoublePrecist } from "@/utils/math";
import { getScaleColor } from "@/utils/tempo";
import { useTempo } from "@/ui/contexts/Tempo";

const getStylePropertyValue = (name: string) => {
  return getComputedStyle(document.body).getPropertyValue(`--${name}`);
};

const getScaleTint = (tempo: number, index: number) => {
  const colorName = getScaleColor(tempo, index);
  const colorHex = getStylePropertyValue(`beat-${colorName !== '' ? colorName : 'black'}`).slice(1);
  return parseInt(colorHex, 16);
}

type BeatScaleProps = {
  time: number,
  scale: number,
  tempo: number,
  width: number,
};

const BeatScale = React.memo(function BeatScale({
  time,
  scale,
  tempo,
  width,
}: BeatScaleProps) {
  extend({ Sprite });

  const beatSubscale = parseDoublePrecist(1 / tempo, 6, -1);

  return (
    <>
      <pixiSprite
        // eslint-disable-next-line react/no-unknown-property
        texture={Texture.WHITE}
        width={width}
        height={2}
        x={0}
        y={time * -scale}
        // eslint-disable-next-line react/no-unknown-property
        tint={getScaleTint(tempo, 0)}
      />
      {new Array(tempo - 1).fill(0).map((_, index) => {
        return (
          <pixiSprite
            // eslint-disable-next-line react/no-unknown-property
            texture={Texture.WHITE}
            width={width}
            height={1}
            x={0}
            y={(time + (index + 1) * beatSubscale) * -scale}
            // eslint-disable-next-line react/no-unknown-property
            anchor={{ x: 0, y: 0.5 }}
            // eslint-disable-next-line react/no-unknown-property
            tint={getScaleTint(tempo, index + 1)}
            key={index}
          />
        );
      })}
    </>
  );
});

type BeatGraphicsProps = {
  timeRangeEnd: number,
  scale: number,
  width: number,
  timeOffset?: number,
};

const BeatGraphics = ({
  timeRangeEnd,
  scale,
  width,
  timeOffset = 0
}: BeatGraphicsProps) => {
  extend({ Container });

  const tempo = useTempo();
  const currentTime = useClockTime().beat - timeOffset;
  const timeRangeStart = Math.floor(currentTime);
  const _timeOffset = useMemo(() => Math.ceil(timeOffset * 2), [timeOffset]);
  const scaleCount = useMemo(() => Math.ceil(timeRangeEnd + _timeOffset), [timeRangeEnd, _timeOffset]);

  return (
    // eslint-disable-next-line react/no-unknown-property
    <pixiContainer zIndex={1} y={currentTime * scale}>
      {new Array(scaleCount).fill(0).map((_, index) => {
        return (
          <BeatScale
            time={timeRangeStart + index}
            scale={scale}
            tempo={tempo}
            width={width}
            key={timeRangeStart + index}
          />
        )
      })}
    </pixiContainer>
  )
};

export default React.memo(BeatGraphics);
