import { useCallback, useEffect, useRef, useState } from "react";
import { setDragStyle } from "@/utils/ui";
import { Nullable } from "@/utils/types";

const getDragStep = (min?: number, max?: number) => {
  if (min !== (void 0) && max !== (void 0)) return (max - min) / 1000;
  else return 0.1;
};

type SliderProps = {
  max: number,
  min: number,
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
  const slideDelta = useRef(NaN);

  const clampValue = useCallback((newValue: number) => {
    if (min !== (void 0) && newValue < min) return min;
    if (max !== (void 0) && newValue > max) return max;
    return newValue;
  }, [max, min]);

  const snapValue = useCallback((value: number) => {
    const _step = step ?? getDragStep(min, max);
    let _value = value;
    let offset = 0;
    if (min !== (void 0)) offset = min;
    else if (max !== (void 0)) offset = max;

    _value -= offset;
    _value = Math.round(_value / _step) * _step;
    _value += offset;

    _value = parseFloat(_value.toPrecision(10));
    return _value;
  }, [min, max, step]);

  const clampSnapValue = useCallback((value: number) => {
    return snapValue(clampValue(value));
  }, [clampValue, snapValue]);

  const valueToPercent = useCallback((value: number) => {
    return value / (max - min) + min;
  }, [min, max]);

  const handleMouseMove = useCallback((e: MouseEvent, emitInput = false) => {
    if (!isSliding.current) return;

    const rect = sliderRef.current!.getBoundingClientRect();
    const sliderPercent = (e.clientX - rect.x) / rect.width;
    const newRealValue = clampSnapValue((rangeDiff * sliderPercent) + min);
    if (lastSliderValue.current !== newRealValue) {
      setValue(sliderPercent);
      if (onChanged) onChanged(newRealValue);
    }

    if (emitInput && onInput) onInput(newRealValue);
    lastSliderValue.current = newRealValue;
  }, [clampSnapValue, rangeDiff, min, onInput, onChanged]);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (isSliding.current) return;

    isSliding.current = true;
    slideDelta.current = 0;
    handleMouseMove(e.nativeEvent);
    setDragStyle('horizontal');
  }, [handleMouseMove]);

  const handleMouseUp = useCallback((e: MouseEvent) => {
    if (!isSliding.current) return;

    setDragStyle();
    handleMouseMove(e, true);
    isSliding.current = false;
    slideDelta.current = NaN;
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
    if (defaultValue === (void 0)) return;
    setValue(valueToPercent(clampSnapValue(defaultValue)));
  }, [defaultValue, valueToPercent, clampSnapValue]);

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
