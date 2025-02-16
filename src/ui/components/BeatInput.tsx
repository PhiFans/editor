import Input from '@/ui/components/NumberInput';
import { BeatArray } from '@/utils/types';
import { useCallback } from 'react';

type BeatInputProps = {
  beat: BeatArray,
  onInput: (beat: BeatArray) => void,
  className?: string,
};

const BeatInput = ({
  beat,
  onInput,
  className,
}: BeatInputProps) => {
  const handleInput = useCallback((index: 0 | 1 | 2, value: number) => {
    const result: BeatArray = [ ...beat ];
    result[index] = value;
    if (index === 0 || index === 1) result[index] -= 1;
    onInput(result);
  }, [beat, onInput]);

  return (
    <div className={`input-beat ${className ?? ''}`}>
      <Input
        min={1}
        step={1}
        dragStep={0.2}
        defaultValue={beat[0] + 1}
        onInput={(e) => handleInput(0, e)}
      />
      <span className='hr'>:</span>
      <Input
        min={1}
        max={beat[2]}
        step={1}
        dragStep={0.2}
        defaultValue={beat[1] + 1}
        onInput={(e) => handleInput(1, e)}
      />
      <span className='hr'>/</span>
      <Input
        min={1}
        step={1}
        dragStep={0.2}
        defaultValue={beat[2]}
        onInput={(e) => handleInput(2, e)}
      />
    </div>
  );
};

export default BeatInput;
