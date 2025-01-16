import { useCallback, useState } from 'react';
import Grid from './Grid';
import './styles.css';

const NotePanel = () => {
  const [ scale, setScale ] = useState(200);
  const [ alignCount, setAlighCount ] = useState(7);

  const updateScale = useCallback((scale: number) => {
    setScale(10 + (scale / 100) * 390);
  }, []);

  return (
    <div className="note-panel">
      <Grid
        scale={scale}
        alignCount={alignCount}
      />
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
            defaultValue={7}
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
