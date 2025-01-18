import { Container, Sprite } from "@pixi/react";
import { Texture } from 'pixi.js';
import { parseDoublePrecist } from "@/utils/math";
import { getScaleColor } from "@/utils/tempo";

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

const BeatScale = ({
  time,
  scale,
  tempo,
  width,
}: BeatScaleProps) => {
  const beatSubscale = parseDoublePrecist(1 / tempo, 6, -1);

  return (
    <>
      <Sprite
        texture={Texture.WHITE}
        width={width}
        height={2}
        x={0}
        y={time * -scale}
        tint={getScaleTint(tempo, 0)}
      />
      {new Array(tempo - 1).fill(0).map((_, index) => {
        return (
          <Sprite
            texture={Texture.WHITE}
            width={width}
            height={1}
            x={0}
            y={(time + (index + 1) * beatSubscale) * -scale}
            tint={getScaleTint(tempo, index + 1)}
            key={index}
          />
        );
      })}
    </>
  );
};

type BeatGraphicsProps = {
  timeRange: [ number, number ],
  scale: number,
  tempo: number,
  width: number,
  timeShift?: number,
};

const BeatGraphics = ({
  timeRange,
  scale,
  tempo,
  width,
  timeShift = 0,
}: BeatGraphicsProps) => {
  const timeRangeStart = Math.floor(timeRange[0] - timeShift);
  const timeRangeLength = Math.ceil(timeRange[1] - timeShift) - timeRangeStart;

  return (
    <Container>
      {new Array(timeRangeLength).fill(0).map((_, index) => {
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
    </Container>
  )
};

export default BeatGraphics;
