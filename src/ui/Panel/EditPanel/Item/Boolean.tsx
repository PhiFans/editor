import { useCallback } from 'react';
import Container from './Container';
import { PanelItemPropsBase } from '../types';

export type BooleanProps = PanelItemPropsBase<boolean>;

const EditPanelBoolean = ({
  label,
  onChanged,
  defaultValue,
}: BooleanProps) => {
  const handleInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    onChanged(target.checked);
  }, [onChanged]);

  return (
    <Container title={label} useLabel>
      <input
        type='checkbox'
        defaultChecked={defaultValue}
        onChange={handleInput}
      />
    </Container>
  );
};

export default EditPanelBoolean;
