import Container from './Container';
import Input from '../Input/Number';
import Slider from '../Input/Slider';
import { PanelItemPropsBase } from "../types";
import { useCallback, useState } from 'react';

export type NumberProps = PanelItemPropsBase<number> & {
  min?: number,
  max?: number,
  step?: number,
  placeholder?: number,
  useSlider?: boolean,
};

const EditPanelNumber = ({
  label,
  onChanged,
  defaultValue,
  min,
  max,
  step,
  placeholder,
  useSlider,
}: NumberProps) => {
  const [ value, setValue ] = useState(defaultValue ?? (min ?? 0));

  const handleValueChanged = useCallback((newVal: number) => {
    setValue(newVal);
  }, []);

  const handleValueInput = useCallback((newVal: number) => {
    handleValueChanged(newVal);
    onChanged(newVal);
  }, [handleValueChanged, onChanged]);

  const inputDom = (
    <Input
      min={min}
      max={max}
      step={step}
      defaultValue={value}
      placeholder={`${placeholder ?? ''}`}
      onChanged={handleValueChanged}
      onInput={handleValueInput}
    />
  );

  return (
    <Container title={label}>
      {max && useSlider ? (
        <>
          <Slider
            min={min}
            max={max}
            step={step}
            defaultValue={value}
            onChanged={handleValueChanged}
            onInput={handleValueInput}
          />
          {inputDom}
        </>
      ) : inputDom}
    </Container>
  )
};

export default EditPanelNumber;
