import { ChangeEvent, useCallback, useState } from 'react';
import Grid from './Grid';
import './styles.css';
import PropsContext from './PropsContext';
import { useSelectedItem } from '../contexts/SelectedItem';
import { Nullable } from '@/utils/types';
import { NoteType } from '@/Chart/types';

const NotePanel = () => {
  const [, setSelectedItem ] = useSelectedItem()!;
  const [ writeMode, setWriteMode ] = useState<Nullable<NoteType>>(null);
  const [ scale, setScale ] = useState(200);
  const [ alignCount, setAlighCount ] = useState(8);

  const updateWriteMode = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const newMode = parseInt(e.target.value) as (NoteType | -1);
    if (newMode === -1) setWriteMode(null);
    else {
      setWriteMode(newMode);
      setSelectedItem((oldItem) => {
        if (oldItem !== null) return { ...oldItem, keyframe: null , note: null };
        else return null;
      });
    }
  }, [setSelectedItem]);

  const updateScale = useCallback((scale: number) => {
    setScale(10 + (scale / 100) * 390);
  }, []);

  return (
    <div className="note-panel">
      <div className='note-panel-controls'>
        <div>
          Mode:
          <label>
            <input
              type='radio'
              value={-1}
              checked={writeMode === null}
              onChange={updateWriteMode}
            />
            Select
          </label>
          <label>
            <input
              type='radio'
              value={NoteType.TAP}
              checked={writeMode === NoteType.TAP}
              onChange={updateWriteMode}
            />
            Tap
          </label>
          <label>
            <input
              type='radio'
              value={NoteType.DRAG}
              checked={writeMode === NoteType.DRAG}
              onChange={updateWriteMode}
            />
            Drag
          </label>
          <label>
            <input
              type='radio'
              value={NoteType.HOLD}
              checked={writeMode === NoteType.HOLD}
              onChange={updateWriteMode}
            />
            Hold
          </label>
          <label>
            <input
              type='radio'
              value={NoteType.FLICK}
              checked={writeMode === NoteType.FLICK}
              onChange={updateWriteMode}
            />
            Flick
          </label>
        </div>
      </div>
      <PropsContext.Provider value={{
        align: alignCount,
        scale,
        writeMode,
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
