import { parseDoublePrecist } from "@/utils/math";
import { Nullable } from "@/utils/types";
import { useCallback, useEffect, useRef, useState } from "react";

type InputPropsBase = {
  type: 'text' | 'number',
  min?: number,
  max?: number,
  step?: number,
  placeholder?: string,
};

type InputPropsString = InputPropsBase & {
  type: 'text',
  defaultValue?: string,
  onChanged?: (newValue: string) => void,
  onInput?: (newValue: string) => void,
};

type InputPropsNumber = InputPropsBase & {
  type: 'number',
  defaultValue?: number,
  onChanged?: (newValue: number) => void,
  onInput?: (newValue: number) => void,
};

type InputProps = InputPropsString | InputPropsNumber;

const EditPanelInput = ({
  type,
  onChanged,
  onInput,
  min,
  max,
  step,
  placeholder,
  defaultValue
}: InputProps) => {
  const _defaultValue = defaultValue ? defaultValue : type === 'text' ? '' : 0;

  const inputRef = useRef<Nullable<HTMLInputElement>>(null);
  const lastChangedValue = useRef<string | number>(_defaultValue);
  const [ value, setValue ] = useState(_defaultValue);

  const handleChanged = useCallback(() => {
    let _value = value;

    if (type === 'number') {
      _value = (_value ?? 0) as number;

      if (min && _value < min) _value = min;
      if (max && _value > max) _value = max;
      if (step) _value = parseDoublePrecist(_value, step, 0);
    }

    if (lastChangedValue.current !== _value) {
      if (onInput) {
        if (type === 'text') onInput(`${_value}`);
        else onInput(_value as number);
      }

      setValue(_value);
      lastChangedValue.current = _value;
    }
  }, [type, min, max, step, onInput, value]);

  const handleInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    let _value: string | number = target.value;

    if (type === 'number') {
      if (_value === '') _value = defaultValue ?? (min ?? 0);
      else if (!isNaN(parseFloat(_value))) _value = parseFloat(target.value);
    }

    setValue(_value);
    if (onChanged) {
      if (type === 'text') onChanged(`${_value}`);
      else onChanged(_value as number);
    }
  }, [type, defaultValue, min, onChanged]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputRef.current) inputRef.current.blur();
  }, []);

  useEffect(() => {
    if (type === 'number') {
      let _value = defaultValue ?? (value as number);
      if (min && _value < min) _value = min;
      if (max && _value > max) _value = max;
      setValue(_value);
    }
    else setValue(value);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValue]);

  return (
    <input
      type={type}
      min={min}
      max={max}
      placeholder={placeholder}
      value={value}
      onChange={handleInput}
      onKeyDown={handleKeyDown}
      onBlur={handleChanged}
      ref={inputRef}
    />
  );
};

export default EditPanelInput;
