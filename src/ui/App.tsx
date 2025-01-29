import GlobalApp from '@/App/App';
import TempoContext from './contexts/Tempo';
import DockPanel from './DockPanel/DockPanel';
import { PopupReadFiles } from '@/utils/file';
import { Nullable } from '@/utils/types';
import { useCallback, useState } from 'react';

function App() {
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

  const handleTempoUpdate = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const newValue = parseInt(target.value);

    if (isNaN(newValue)) return;
    if (newValue <= 0) return;
    setTempo(newValue);
  }, []);

  return (
    <>
      <div className="files">
        <button onClick={() => onImportAudio()}>Import music</button>
        <button onClick={() => onCreateChart()}>Create chart</button>
        <button onClick={() => onExportChart()}>Export chart</button>
      </div>
      <div className="settings">
        <label>
          Set tempo: 1/
          <input
            type='number'
            min={1}
            defaultValue={4}
            onChange={handleTempoUpdate}
            style={{
              width: 38
            }}
          />
        </label>
      </div>
      <TempoContext.Provider value={tempo}>
        <DockPanel />
      </TempoContext.Provider>
    </>
  );
}

export default App;
