import Input from '@/ui/components/NumberInput';
import { BeatArray } from '@/utils/types';
import { useCallback } from 'react';

type BPMBeatInputProps = {
  beat: BeatArray,
  onInput: (beat: BeatArray) => void,
};

const BPMBeatInput = ({
  beat,
  onInput,
}: BPMBeatInputProps) => {
  const handleInput = useCallback((index: 0 | 1 | 2, value: number) => {
    const result: BeatArray = [ ...beat ];
    result[index] = value;
    onInput(result);
  }, [beat, onInput]);

  return (
    <div className="bpm-input-beat">
      <Input
        min={0}
        step={1}
        defaultValue={beat[0]}
        onInput={(e) => handleInput(0, e)}
      />
      <span className='hr'>:</span>
      <Input
        min={0}
        max={beat[2] - 1}
        step={1}
        defaultValue={beat[1]}
        onInput={(e) => handleInput(1, e)}
      />
      <span className='hr'>/</span>
      <Input
        min={1}
        step={1}
        defaultValue={beat[2]}
        onInput={(e) => handleInput(2, e)}
      />
    </div>
  );
};

export default BPMBeatInput;
