import { FormGroup, InputGroup } from '@blueprintjs/core';
import { ChartInfo } from '@/Chart/types';
import { FormEvent } from 'react';

type ProjectInputProps = {
  type: keyof ChartInfo,
  label: string,
  onInput: (key: keyof ChartInfo, value: string) => void,
  sublabel?: string,
  placeholder?: string,
  defaultValue?: string,
  onBlur?: () => void,
};

const ProjectInput = ({
  type,
  label,
  onInput,
  sublabel,
  placeholder,
  defaultValue,
  onBlur
}: ProjectInputProps) => {
  const handleInput = (e: FormEvent<HTMLInputElement>) => {
    const value = (e.target as HTMLInputElement).value;
    onInput(type, value);
  };

  return (
    <FormGroup
      label={label}
      helperText={sublabel}
      fill
    >
      <InputGroup
        placeholder={placeholder}
        defaultValue={defaultValue}
        onInput={handleInput}
        onBlur={onBlur}
      />
    </FormGroup>
  );
};

export default ProjectInput;
