import { useCallback } from 'react';
import Container from './Container';
import { PanelItemPropsBase } from '../types';

export type DropdownPropsBase = PanelItemPropsBase<string | number> & {
  type?: 'string' | 'number',
  options: {
    value: string | number,
    label: string,
    disabled?: boolean,
  }[],
};

export type DropdownPropsNumber = DropdownPropsBase & {
  type: 'number',
  onChanged: (newValue: number) => void,
  options: {
    value: number,
    label: string,
    disabled?: boolean,
  }[],
  defaultValue?: number,
};

export type DropdownProps = DropdownPropsBase | DropdownPropsNumber;

const EditPanelDropdown = ({
  label,
  options,
  type = 'string',
  onChanged,
  defaultValue,
}: DropdownProps) => {
  const handleValueChanged = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const target = e.target as HTMLSelectElement;
    if (type === 'number') onChanged(parseFloat(target.value));
    else onChanged(target.value);
  }, [type, onChanged]);

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
