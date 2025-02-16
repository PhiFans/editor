import { useCallback, useEffect, useRef, useState } from 'react';
import { setDragStyle } from '@/utils/ui';
import { Nullable } from '@/utils/types';

// Thanks to [lil.gui](https://github.com/georgealways/lil-gui/blob/master/src/NumberController.js#L140)
// for the drag algorithm

const DRAG_THRESH = 5;

const getDragStep = (min?: number, max?: number) => {
  if (min !== (void 0) && max !== (void 0)) return (max - min) / 1000;
  else return 0.1;
};

type NumberInputProps = {
  min?: number,
  max?: number,
  step?: number,
  dragStep?: number,
  defaultValue?: number,
  placeholder?: string,
  onChanged?: (newValue: number) => void,
  onInput?: (newValue: number) => void,
};

const NumberInput = ({
  min,
  max,
  step,
  dragStep,
  defaultValue,
  placeholder,
  onChanged,
  onInput
}: NumberInputProps) => {
  const [ value, setValue ] = useState<Nullable<number>>(defaultValue ?? null);
  const inputRef = useRef<Nullable<HTMLInputElement>>(null);
  const lastChanged = useRef<number>(defaultValue ?? (min ?? 0));
  const lastInput = useRef<number>(defaultValue ?? (min ?? 0));

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

  const handleChanged = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const value = parseFloat(target.value);

    if (!isNaN(value)) {
      setValue(value);

      const _value = clampSnapValue(value);
      if (lastChanged.current !== _value) {
        if (onChanged) onChanged(_value);
        lastChanged.current = _value;
      }
    } else {
      setValue(null);
    }
  }, [onChanged, clampSnapValue]);

  const handleChangeEnd = useCallback(() => {
    if (isDragTesting.current) return;

    const _value = clampSnapValue(value ?? lastInput.current);
    setValue(_value);

    if (lastInput.current !== _value) {
      if (onInput) onInput(_value);
      lastInput.current = _value;
    }
  }, [value, onInput, clampSnapValue]);

  const handleKeydown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!inputRef.current) return;
    if (e.key === 'Enter') inputRef.current.blur();
  }, []);

  // Handle dragging
  const isDragging = useRef(false);
  const isDragTesting = useRef(false);
  const dragStartValue = useRef<number>(lastInput.current);
  const dragStartPosX = useRef<number>(NaN);
  const dragStartPosY = useRef<number>(NaN);
  const dragPrevPosY = useRef<number>(NaN);
  const dragDelta = useRef(NaN);

  const handleMouseUp = useCallback(() => {
    if (!isDragging.current) return;
    if (!isNaN(dragDelta.current)) handleChangeEnd();

    isDragging.current = false;
    isDragTesting.current = false;

    dragStartPosX.current = NaN;
    dragStartPosY.current = NaN;
    dragPrevPosY.current = NaN;

    dragDelta.current = NaN;
    setDragStyle();
  }, [handleChangeEnd]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging.current) return;
    if (!inputRef.current) return;

    if (isDragTesting.current) {
      const dx = e.clientX - dragStartPosX.current;
      const dy = e.clientY - dragStartPosY.current;

      if (Math.abs(dy) > DRAG_THRESH) {
        e.preventDefault();
        inputRef.current.blur();
        isDragTesting.current = false;
        setDragStyle('vertical');

      } else if (Math.abs(dx) > DRAG_THRESH) {
        handleMouseUp();
      }
    } else {
      if (isNaN(dragDelta.current)) dragDelta.current = 0;

      const dy = e.clientY - dragPrevPosY.current;
      dragDelta.current -= dy * (dragStep ?? step ?? getDragStep(min, max));

      if (max !== (void 0) && dragStartValue.current + dragDelta.current > max) {
        dragDelta.current = max - dragStartValue.current;
      } else if (min !== (void 0) && dragStartValue.current + dragDelta.current < min) {
        dragDelta.current = min - dragStartValue.current;
      }

      const dragValue = clampSnapValue(parseFloat((dragDelta.current + dragStartValue.current).toPrecision(10)));
      if (dragValue !== lastChanged.current) {
        setValue(dragValue);
        if (onChanged) onChanged(dragValue);
        lastChanged.current = dragValue;
      }

      dragPrevPosY.current = e.clientY;
    }
  }, [min, max, dragStep, step, onChanged, handleMouseUp, clampSnapValue]);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
    isDragging.current = true;
    isDragTesting.current = true;
    dragStartValue.current = value ?? defaultValue ?? (min ?? 0);

    dragStartPosX.current = e.clientX;
    dragStartPosY.current = e.clientY;
    dragPrevPosY.current = e.clientY;
  }, [defaultValue, min, value]);

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
    setValue(clampSnapValue(defaultValue));
  }, [clampSnapValue, defaultValue]);

  return (
    <input
      type="number"
      min={min}
      max={max}
      step={step}
      value={value ?? ''}
      placeholder={placeholder}
      onChange={handleChanged}
      onBlur={handleChangeEnd}
      onKeyDown={handleKeydown}
      onMouseDown={handleMouseDown}
      ref={inputRef}
    />
  )
};

export default NumberInput;
