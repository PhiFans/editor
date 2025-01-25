import DockLayout, { LayoutData } from 'rc-dock';
import NotePanel from '../NotePanel/NotePanel';
import PreviewPanel from '../PreviewPanel/PreviewPanel';
import Timeline from '../Timeline/Timeline';
import EditPanel from '../EditPanel/EditPanel';
import BPMPanel from '../BPMPanel/BPMPanel';
import SelectedItemProvider from '../contexts/SelectedItem/Provider';
import ClockTimeProvider from '../contexts/Clock/Provider';

const dockLayout: LayoutData = {
  dockbox: {
    mode: 'horizontal',
    children: [
      {
        mode: 'vertical',
        children: [
          {
            mode: 'horizontal',
            children: [
              {
                size: 60,
                tabs: [
                  {
                    id: 'note-panel',
                    title: 'Note panel',
                    cached: true,
                    content: (<NotePanel />),
                  }
                ]
              },
              {
                tabs: [
                  {
                    id: 'live-preview',
                    title: 'Live preview',
                    cached: true,
                    content: (<PreviewPanel />)
                  }
                ]
              },
            ]
          },
          {
            size: 80,
            tabs: [
              {
                id: 'timeline',
                title: 'Timeline',
                cached: true,
                content: (<Timeline />)
              }
            ]
          }
        ]
      },
      {
        size: 60,
        tabs: [
          {
            id: 'edit-panel',
            title: 'Edit panel',
            cached: true,
            content: (<EditPanel />),
          },
          {
            id: 'bpm-panel',
            title: 'BPM',
            cached: true,
            content: (<BPMPanel />)
          }
        ]
      }
    ]
  },
};

const DockPanel = () => {
  return (
    <div className='dock-panel'>
      <SelectedItemProvider>
        <ClockTimeProvider>
          <DockLayout
            defaultLayout={dockLayout}
          />
        </ClockTimeProvider>
      </SelectedItemProvider>
    </div>
  );
};

export default DockPanel;
