import { useState } from 'react';
import { Button, Card } from '@blueprintjs/core';
import { ChartInfo } from '@/Chart/types';
import ProjectInput from './Input';

type ProjectPanelProps = {
  project?: ChartInfo,
  showButton?: boolean,
  onCreate?: (newInfo: ChartInfo) => void,
  onCancel?: () => void,
  onChanged?: (newInfo: ChartInfo) => void,
};

const ProjectPanel = ({
  project: defaultProject,
  showButton,
  onCreate,
  onCancel,
  onChanged,
}: ProjectPanelProps) => {
  const [ project, setProject ] = useState<ChartInfo>({
    name: '',
    artist: '',
    illustration: '',
    level: '',
    designer: '',
    ...(defaultProject ?? {})
  });

  const handleInfoInput = (key: keyof ChartInfo, value: string) => {
    setProject((prj) => {
      prj[key] = value;
      return prj
    });
  };

  const handleInputBlur = () => {
    if (!onChanged) return;
    if (showButton) return;
    onChanged(project);
  };

  return (
    <div style={{
      width: '100%',
      height: '100%',
      overflowX: 'hidden',
      overflowY: 'auto',
    }}>
      <Card>
      <ProjectInput
          type='name'
          label='Name'
          placeholder='Song name'
          onInput={handleInfoInput}
          onBlur={handleInputBlur}
        />

        <ProjectInput
          type='artist'
          label='Artist'
          placeholder='Song artist'
          onInput={handleInfoInput}
          onBlur={handleInputBlur}
        />

        <ProjectInput
          type='illustration'
          label='Illustrator'
          placeholder='Background illustrator'
          onInput={handleInfoInput}
          onBlur={handleInputBlur}
        />

        <ProjectInput
          type='level'
          label='Level'
          placeholder='SP Lv.?'
          onInput={handleInfoInput}
          onBlur={handleInputBlur}
        />

        <ProjectInput
          type='designer'
          label='Designer'
          placeholder='Song charter'
          onInput={handleInfoInput}
          onBlur={handleInputBlur}
        />

        {showButton && (<>
          {onCreate && (
          <Button intent='primary' onClick={() => onCreate(project)}>{defaultProject ? 'Update' : 'Create'}</Button>
          )}
          {onCancel && (
            <Button onClick={onCancel}>Cancel</Button>
          )}
        </>)}
      </Card>
    </div>
  );
};

export default ProjectPanel;
