import GlobalApp from '@/App/App';
import TempoContext from './contexts/Tempo';
import PanelDock from './Panel/PanelDock';
import { PopupReadFiles, ReadFileAsText } from '@/utils/file';
import { Nullable } from '@/utils/types';
import { useCallback, useRef, useState } from 'react';
import AppBar from './Bar/AppBar';
import SettingsProvider from './contexts/Settings/Provider';
import DockLayout from 'rc-dock';
import SettingsPanel from './Panel/SettingsPanel/SettingsPanel';
import { ChartExported } from '@/Chart/Chart';
import NumberInput from './components/NumberInput';

function App() {
  const dockRef = useRef<Nullable<DockLayout>>(null);
  const [ tempo, setTempo ] = useState(4);
  let importedMusic: Nullable<File> = null;

  const onImportAudio = () => {
    PopupReadFiles(false)
      .then((files) => {
        if (!files || files.length === 0) return;
        importedMusic = files[0];
      })
      .catch((e) => console.error(e));
  };

  const onCreateChart = () => {
    if (!importedMusic) return;
    if (GlobalApp.chart) return;

    GlobalApp.createChart({
      name: 'test',
      artist: 'test',
      illustration: 'test',
      level: 'test',
      designer: 'test'
    }, importedMusic, importedMusic, true);
  };

  const onLoadChart = () => {
    if (!importedMusic) return;
    if (GlobalApp.chart) return;

    PopupReadFiles(false)
      .then(async (files) => {
        if (!files || files.length === 0) return;
        const chartRaw = JSON.parse(await ReadFileAsText(files[0])) as ChartExported;
        GlobalApp.loadChart(chartRaw, importedMusic!, importedMusic!);
      })
      .catch((e) => console.error(e));
  };

  const onExportChart = () => {
    if (!GlobalApp.chart) return;

    const chartText = JSON.stringify(GlobalApp.chart.json, null, 4);
    const chartBlob = new Blob([ chartText ], { type: 'text/json' });
    const chartUrl = URL.createObjectURL(chartBlob);

    const downloadDom = document.createElement('a');
    downloadDom.href = chartUrl;
    downloadDom.download = 'exported.json';
    downloadDom.click();
  };

  const handleTempoUpdate = useCallback((tempo: number) => {
    setTempo(tempo);
  }, []);

  const showSettingsPanel = () => {
    const dock = dockRef.current;
    if (!dock) return;
    if (dock.find('settings-panel')) return;

    dock.dockMove({
      id: 'settings-panel',
      title: 'Settings',
      cached: true,
      closable: true,
      content: (<SettingsPanel />),
    }, null, 'float');
  };

  return (
    <>
      <SettingsProvider>
        <AppBar>
          <div className="files">
            <button onClick={() => onImportAudio()}>Import music</button>
            <button onClick={() => onCreateChart()}>Create chart</button>
            <button onClick={onLoadChart}>Load chart</button>
            <button onClick={() => onExportChart()}>Export chart</button>
          </div>
          <span className='hr'>|</span>
          <div>
            <button onClick={showSettingsPanel}>Settings</button>
          </div>
        </AppBar>
        <TempoContext.Provider value={tempo}>
          <PanelDock
            ref={dockRef}
          />
        </TempoContext.Provider>
        <AppBar>
          <div className="settings">
            <label>
              Set tempo: 1/
              <NumberInput
                min={1}
                defaultValue={4}
                step={1}
                dragStep={0.1}
                onChanged={handleTempoUpdate}
                style={{
                  width: 50
                }}
              />
            </label>
          </div>
        </AppBar>
      </SettingsProvider>
    </>
  );
}

export default App;
