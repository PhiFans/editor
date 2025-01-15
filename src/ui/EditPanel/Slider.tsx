import { useCallback, useEffect, useRef, useState } from "react";
import { parseDoublePrecist } from "@/utils/math";
import { Nullable } from "@/utils/types";

type SliderProps = {
  max: number,
  min?: number,
  step?: number,
  defaultValue?: number,
  height?: number,
  onChanged?: (newValue: number) => void,
  onInput?: (newValue: number) => void,
};

const EditPanelSlider = ({
  min,
  max,
  step,
  defaultValue,
  height,
  onChanged,
  onInput
}: SliderProps) => {
  const rangeDiff = max - (min ?? 0);
  const [ value, setValue ] = useState(((defaultValue ?? 0) - (min ?? 0)) / rangeDiff);
  const sliderRef = useRef<Nullable<HTMLDivElement>>(null);
  const isSliding = useRef(false);
  const lastSliderValue = useRef((defaultValue ?? min ?? 0));

  const handleMouseMove = useCallback((e: MouseEvent, emitInput = false) => {
    if (!isSliding.current) return;

    const rect = sliderRef.current!.getBoundingClientRect();
    let sliderPercent = (e.clientX - rect.x) / rect.width;
    if (sliderPercent > 1) sliderPercent = 1;
    if (sliderPercent < 0) sliderPercent = 0;

    const newRealValue = parseDoublePrecist((rangeDiff * sliderPercent) + (min ?? 0), step ?? 6, 0);
    if (lastSliderValue.current !== newRealValue) {
      setValue(sliderPercent);
      if (onChanged) onChanged(newRealValue);
    }

    if (emitInput && onInput) onInput(newRealValue);
    lastSliderValue.current = newRealValue;
  }, [min, step, rangeDiff, onChanged, onInput]);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (isSliding.current) return;

    isSliding.current = true;
    handleMouseMove(e.nativeEvent);
  }, [handleMouseMove]);

  const handleMouseUp = useCallback((e: MouseEvent) => {
    if (!isSliding.current) return;

    handleMouseMove(e, true);
    isSliding.current = false;
  }, [handleMouseMove]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return (() => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    });
  }, [handleMouseMove, handleMouseUp]);

  useEffect(() => {
    let newValue = defaultValue ?? value;
    if (min && newValue < min) newValue = min;
    if (max && newValue > max) newValue = max;
    setValue(newValue / rangeDiff + (min ?? 0));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValue]);

  return (
    <div
      className="edit-panel-slider"
      style={{
        height,
        '--value-percent': value,
      } as React.CSSProperties}
      onMouseDown={handleMouseDown}
      ref={sliderRef}
    ></div>
  );
};

export default EditPanelSlider;
