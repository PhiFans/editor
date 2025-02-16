import Container from './Container';
import BeatInput from '@/ui/components/BeatInput';
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

  const handleInput = useCallback((newBeat: BeatArray) => {
    if (isNaN(BeatArrayToNumber(newBeat))) return;
    setValue(newBeat);
    onChanged(newBeat);
  }, [onChanged]);

  return (
    <Container title={label} className='edit-panel-input-beat'>
      <BeatInput
        beat={value}
        onInput={handleInput}
      />
    </Container>
  )
};

export default EditPanelBeat;
