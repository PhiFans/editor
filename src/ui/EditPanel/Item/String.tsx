import Container from './ItemContainer';
import Input from './Input';
import { PanelItemPropsBase } from "./types";

export type StringProps = PanelItemPropsBase<string> & {
  placeholder?: string,
};

const EditPanelString = ({
  label,
  onChanged,
  defaultValue,
  placeholder,
}: StringProps) => {
  return (
    <Container title={label}>
      <Input
        type="text"
        defaultValue={defaultValue}
        placeholder={placeholder}
        onInput={onChanged}
      />
    </Container>
  )
};

export default EditPanelString;
