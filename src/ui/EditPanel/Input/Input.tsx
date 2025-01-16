import { Nullable } from "@/utils/types";
import { useCallback, useEffect, useRef, useState } from "react";

type InputProps = {
  placeholder?: string,
  defaultValue?: string,
  onChanged?: (newValue: string) => void,
  onInput?: (newValue: string) => void,
};

const EditPanelInput = ({
  onChanged,
  onInput,
  placeholder,
  defaultValue
}: InputProps) => {
  const inputRef = useRef<Nullable<HTMLInputElement>>(null);
  const lastInput = useRef<string>(defaultValue ?? '');
  const [ value, setValue ] = useState(defaultValue);

  const handleChanged = useCallback(() => {
    if (lastInput.current === value) return;

    setValue(lastInput.current);
    if (onInput) onInput(lastInput.current);
  }, [onInput, value]);

  const handleInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const value = target.value;

    setValue(value);
    if (onChanged) onChanged(value);
    lastInput.current = value;
  }, [onChanged]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputRef.current) inputRef.current.blur();
  }, []);

  useEffect(() => {
    setValue(defaultValue ?? '');
  }, [defaultValue]);

  return (
    <input
      type='text'
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
