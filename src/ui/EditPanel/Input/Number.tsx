import { parseDoublePrecist } from '@/utils/math';
import { Nullable } from '@/utils/types';
import { useCallback, useEffect, useRef, useState } from 'react';

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
  defaultValue?: number,
  placeholder?: string,
  onChanged?: (newValue: number) => void,
  onInput?: (newValue: number) => void,
};

const EditPanelInputNumber = ({
  min,
  max,
  step,
  defaultValue,
  placeholder,
  onChanged,
  onInput
}: NumberInputProps) => {
  const [ value, setValue ] = useState<Nullable<number>>(defaultValue ?? null);
  const inputRef = useRef<Nullable<HTMLInputElement>>(null);
  const lastInput = useRef<number>(defaultValue ?? (min ?? 0));

  const clampValue = useCallback((newValue: number) => {
    if (min !== (void 0) && newValue < min) return min;
    if (max !== (void 0) && newValue > max) return max;
    return newValue;
  }, [max, min]);

  const handleChanged = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const value = parseFloat(target.value);

    if (!isNaN(value)) {
      setValue(value);

      const _value = clampValue(value);
      if (onChanged) onChanged(_value);
      lastInput.current = _value;
    } else {
      setValue(null);
    }
  }, [onChanged, clampValue]);

  const handleChangeEnd = useCallback(() => {
    if (isDragTesting.current) return;

    const _value = clampValue(value ?? lastInput.current);
    setValue(_value);
    if (onInput) onInput(_value);
    lastInput.current = _value;
  }, [value, onInput, clampValue]);

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

      } else if (Math.abs(dx) > DRAG_THRESH) {
        handleMouseUp();
      }
    } else {
      if (isNaN(dragDelta.current)) dragDelta.current = 0;

      const dy = e.clientY - dragPrevPosY.current;
      dragDelta.current -= dy * (step ?? getDragStep(min, max));

      if (max !== (void 0) && dragStartValue.current + dragDelta.current > max) {
        dragDelta.current = max - dragStartValue.current;
      } else if (min !== (void 0) && dragStartValue.current + dragDelta.current < min) {
        dragDelta.current = min - dragStartValue.current;
      }

      const dragValue = parseDoublePrecist(dragDelta.current + dragStartValue.current, 6, 0);
      if (dragValue !== lastInput.current) {
        setValue(dragValue);
        if (onChanged) onChanged(dragValue);
        lastInput.current = dragValue;
      }

      dragPrevPosY.current = e.clientY;
    }
  }, [min, max, step, onChanged, handleMouseUp]);

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

export default EditPanelInputNumber;
