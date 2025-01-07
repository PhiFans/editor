import Timeline from './Timeline/Timeline';
import GlobalApp from '@/App/App';
import AudioClip from '@/Audio/Clip';
import { PopupReadFiles } from '@/utils/file';
import { Nullable } from '@/utils/types';
import { useState } from 'react';


function App() {
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
    GlobalApp.chart!.events.once('audio-clip-loaded', (clip: AudioClip) => {
      setTimeLength(clip.duration);
    });
  };

  return (
    <>
      <div className="files">
        <button onClick={() => onImportAudio()}>Import music</button>
        <button onClick={() => onCreateChart()}>Create chart</button>
      </div>
      <div className="">
        <Timeline timeLength={timeLength} items={[]} />
      </div>
    </>
  );
}

export default App
