import Container from './ItemContainer';
import Input from './Input';
import { PanelItemPropsBase } from "./types";

type InputProps = PanelItemPropsBase<number> & {
  min?: number,
  max?: number,
  step?: number,
  placeholder?: number,
};

const EditPanelNumber = ({
  label,
  onChanged,
  defaultValue,
  min,
  max,
  step,
  placeholder,
}: InputProps) => {
  return (
    <Container title={label}>
      <Input
        type="number"
        min={min}
        max={max}
        step={step}
        defaultValue={defaultValue}
        placeholder={`${placeholder ?? ''}`}
        onInput={onChanged}
      />
    </Container>
  )
};

export default EditPanelNumber;
