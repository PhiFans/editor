import { useCallback } from 'react';
import Container from './Container';
import { PanelItemPropsBase } from '../types';

export type DropdownProps = PanelItemPropsBase<string> & {
  options: {
    value: string,
    label: string,
    disabled?: boolean,
  }[],
};

const EditPanelDropdown = ({
  label,
  options,
  onChanged,
  defaultValue,
}: DropdownProps) => {
  const handleValueChanged = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const target = e.target as HTMLSelectElement;
    onChanged(target.value);
  }, [onChanged]);

  return (
    <Container title={label}>
      <select
        defaultValue={defaultValue}
        onChange={handleValueChanged}
      >
        {options.map((option) => {
          return <option
            value={option.value}
            disabled={option.disabled}
            key={option.value}
          >{option.label}</option>
        })}
      </select>
    </Container>
  );
};

export default EditPanelDropdown;
