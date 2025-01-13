import ClockTimeProvider from './contexts/Clock/Provider';
import Timeline from './Timeline/Timeline';
import GlobalApp from '@/App/App';
import { PopupReadFiles } from '@/utils/file';
import { Nullable } from '@/utils/types';
import { useCallback, useState } from 'react';
import TempoContext from './contexts/Tempo';

function App() {
  const [ tempo, setTempo ] = useState(4);
  const [ timeLength, setTimeLength ] = useState(0);
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
    // XXX: This is the stupid way
    GlobalApp.events.once('chart.audioClip.loaded', () => {
      setTimeLength(GlobalApp.chart!.beatDuration);
    });
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
      <div className="">
        <TempoContext.Provider value={tempo}>
          <ClockTimeProvider>
            <Timeline timeLength={timeLength} />
          </ClockTimeProvider>
        </TempoContext.Provider>
      </div>
    </>
  );
}

export default App
