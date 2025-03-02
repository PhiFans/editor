import { useState } from 'react';
import { ChartInfo } from '@/Chart/types';
import ProjectInput from './Input';

type ProjectPanelProps = {
  project?: ChartInfo,
  onChanged?: (newInfo: ChartInfo) => void,
};

const ProjectPanel = ({
  project: defaultProject,
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
    onChanged(project);
  };

  return (
    <div style={{
      width: '100%',
      height: '100%',
      overflowX: 'hidden',
      overflowY: 'auto',
    }}>
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
    </div>
  );
};

export default ProjectPanel;
