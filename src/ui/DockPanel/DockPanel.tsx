import DockLayout, { LayoutData } from 'rc-dock';
import NotePanel from '../NotePanel/NotePanel';
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
                    content: (<NotePanel />),
                  }
                ]
              },
              {
                tabs: [
                  {
                    id: 'live-preview',
                    title: 'Live preview',
                    content: (<div className='live-preview'></div>)
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
            content: (<EditPanel />),
          },
          {
            id: 'bpm-panel',
            title: 'BPM',
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
