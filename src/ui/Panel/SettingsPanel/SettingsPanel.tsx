import { Tab, Tabs } from '@blueprintjs/core';
import SettingsRendering from './Rendering';
import './styles.css';

const SettingsPanel = () => {
  return (
    <Tabs
      id='settings'
      className='settings-panel'
      animate
      vertical
      renderActiveTabPanelOnly
    >
      <Tab id='rendering' title='Rendering' panel={<SettingsRendering />} />
    </Tabs>
  );
};

export default SettingsPanel;
