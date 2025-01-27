import Container from './Container';
import Input from '../../components/NumberInput';
import { PanelItemPropsBase } from '../types';
import { BeatArray } from '@/utils/types';
import { useCallback, useState } from 'react';
import { BeatArrayToNumber } from '@/utils/math';

export type BeatProps = PanelItemPropsBase<BeatArray>;

const EditPanelBeat = ({
  label,
  onChanged,
  defaultValue,
}: BeatProps) => {
  const [ value, setValue ] = useState<BeatArray>(defaultValue ?? [ 0, 0, 1 ]);

  const handleInput = useCallback((index: number, newValue: number) => {
    const _value: BeatArray = [ ...value ];
    _value[index] = newValue;

    if (isNaN(BeatArrayToNumber(_value))) return;
    setValue(_value);
    onChanged(_value);
  }, [onChanged, value]);

  return (
    <Container title={label} className='edit-panel-input-beat'>
      <Input
        min={0}
        step={1}
        defaultValue={value[0]}
        onChanged={(e) => handleInput(0, e)}
      />
      <span className='hr'>:</span>
      <Input
        min={0}
        max={value[2] - 1}
        step={1}
        defaultValue={value[1]}
        onChanged={(e) => handleInput(1, e)}
      />
      <span className='hr'>/</span>
      <Input
        min={1}
        step={1}
        defaultValue={value[2]}
        onChanged={(e) => handleInput(2, e)}
      />
    </Container>
  )
};

export default EditPanelBeat;
