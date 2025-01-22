import { useCallback, useState } from 'react';
import Grid from './Grid';
import './styles.css';
import PropsContext from './PropsContext';

const NotePanel = () => {
  const [ isWriteMode, setWriteMode ] = useState(false);
  const [ scale, setScale ] = useState(200);
  const [ alignCount, setAlighCount ] = useState(8);

  const updateWriteMode = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    setWriteMode(target.checked);
  }, []);

  const updateScale = useCallback((scale: number) => {
    setScale(10 + (scale / 100) * 390);
  }, []);

  return (
    <div className="note-panel">
      <div className='note-panel-controls'>
        <label>
          Write mode:
          <input
            type='checkbox'
            checked={isWriteMode}
            onChange={updateWriteMode}
          />
        </label>
      </div>
      <PropsContext.Provider value={{
        align: alignCount,
        scale,
        writeMode: isWriteMode,
      }}>
        <Grid />
      </PropsContext.Provider>
      <div className="note-panel-controls">
        <label>
          Scale:
          <input
            type='range'
            min={0}
            max={100}
            defaultValue={50}
            onChange={(e) => updateScale(100 - parseInt(e.target.value))}
          />
        </label>
        <label>
          Align:
          <input
            type='number'
            min={1}
            defaultValue={8}
            style={{
              width: 50
            }}
            onChange={(e) => setAlighCount(parseInt(e.target.value))}
          />
        </label>
      </div>
    </div>
  );
};

export default NotePanel;
