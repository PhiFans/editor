import { Button, DialogBody, DialogFooter, FileInput, FormGroup, MenuItem } from '@blueprintjs/core';
import { useRef } from 'react';
import Chart from '@/Chart/Chart';
import ProjectPanel from '@/ui/Panel/ProjectPanel/ProjectPanel';
import { useDialog } from '@/ui/contexts/Dialog';
import { ChartInfo } from '@/Chart/types';
import { Nullable } from '@/utils/types';

type ProjectFile = 'music' | 'background';

type ProjectMeta = ChartInfo & {
  music: File,
  background: File,
};

const CreateProject = () => {
  const { show: showDialog, close: closeDialog } = useDialog();
  const newProjectMeta = useRef<Partial<ProjectMeta>>({});

  const updateNewProjectMeta = (metaOrFile: Nullable<ChartInfo | FileList>, fileType?: ProjectFile) => {
    if (!metaOrFile) return;
    if (!(metaOrFile instanceof FileList)) {
      newProjectMeta.current = {
        ...newProjectMeta.current,
        ...metaOrFile,
      };
      return;
    }

    if (!fileType) return;
    if (metaOrFile.length !== 1) return;
    const file = metaOrFile[0];

    newProjectMeta.current[fileType] = file;
  };

  const createProject = () => {
    closeDialog();

    const projectMeta: ChartInfo & Partial<ProjectMeta> = {
      name: 'Untitled',
      artist: 'Unknown',
      illustration: 'Unknown',
      level: 'SP Lv.?',
      designer: 'Unknown',
      ...newProjectMeta.current,
    };

    if (!projectMeta.music) {
      showDialog({
        title: 'Error',
        onClose: closeDialog,
        children: (
          <>
            <DialogBody>No music file selected</DialogBody>
            <DialogFooter
              actions={
                <Button onClick={closeDialog}>Close</Button>
              }
            />
          </>
        )
      });
      return;
    }

    if (!projectMeta.background) {
      showDialog({
        title: 'Error',
        onClose: closeDialog,
        children: (
          <>
            <DialogBody>No background file selected</DialogBody>
            <DialogFooter
              actions={
                <Button onClick={closeDialog}>Close</Button>
              }
            />
          </>
        )
      });
      return;
    }

    Chart.create(projectMeta as ProjectMeta);
  }

  const handleOpenDialog = () => {
    showDialog({
      title: 'Create Project',
      onClose: closeDialog,
      children: (
        <>
          <DialogBody>
            <FormGroup
              label='Music File'
              fill
            >
              <FileInput
                onInputChange={(e) => updateNewProjectMeta((e.target as HTMLInputElement).files, 'music')}
                fill
              />
            </FormGroup>

            <FormGroup
              label='Background Image File'
              fill
            >
              <FileInput
                onInputChange={(e) => updateNewProjectMeta((e.target as HTMLInputElement).files, 'background')}
                fill
              />
            </FormGroup>

            <ProjectPanel
              onChanged={updateNewProjectMeta}
            />
          </DialogBody>
          <DialogFooter
            actions={(
              <>
                <Button onClick={closeDialog}>Cancel</Button>
                <Button onClick={createProject} intent='primary'>Create</Button>
              </>
            )}
          />
        </>
      )
    });
  };

  return (
    <MenuItem
      text="Create project"
      onClick={handleOpenDialog}
    />
  );
};

export default CreateProject;
