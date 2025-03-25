import { ChangeEvent, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Grid from './Grid';
import './styles.css';
import PropsContext from './PropsContext';
import { useSelectedItem } from '../../contexts/SelectedItem';
import { Nullable } from '@/utils/types';
import { NoteType } from '@/Chart/types';
import NumberInput from '@/ui/components/NumberInput';

const NotePanel = () => {
  const { t } = useTranslation();
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
        {t('note_panel.mode_select.title')}
          <label>
            <input
              type='radio'
              value={-1}
              checked={writeMode === null}
              onChange={updateWriteMode}
            />
            {t('note_panel.mode_select.select')}
          </label>
          <label>
            <input
              type='radio'
              value={NoteType.TAP}
              checked={writeMode === NoteType.TAP}
              onChange={updateWriteMode}
            />
            {t('note.type.tap')}
          </label>
          <label>
            <input
              type='radio'
              value={NoteType.DRAG}
              checked={writeMode === NoteType.DRAG}
              onChange={updateWriteMode}
            />
            {t('note.type.drag')}
          </label>
          <label>
            <input
              type='radio'
              value={NoteType.HOLD}
              checked={writeMode === NoteType.HOLD}
              onChange={updateWriteMode}
            />
            {t('note.type.hold')}
          </label>
          <label>
            <input
              type='radio'
              value={NoteType.FLICK}
              checked={writeMode === NoteType.FLICK}
              onChange={updateWriteMode}
            />
            {t('note.type.flick')}
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
          {t('common.scale')}:
          <input
            type='range'
            min={0}
            max={100}
            defaultValue={50}
            onChange={(e) => updateScale(100 - parseInt(e.target.value))}
          />
        </label>
        <label>
        {t('common.align')}:
          <NumberInput
            min={1}
            defaultValue={8}
            step={1}
            dragStep={0.1}
            onChanged={setAlighCount}
            style={{
              width: 50
            }}
          />
        </label>
      </div>
    </div>
  );
};

export default NotePanel;
