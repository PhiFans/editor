import { useCallback, useEffect, useState } from 'react';
import { useSelectedItem } from '../contexts/SelectedItem';
import List from './List';
import { BeatArray, Nullable } from '@/utils/types';
import ChartKeyframe, { TChartKeyframe } from '@/Chart/Keyframe';
import ChartNote from '@/Chart/Note';
import ChartJudgeline from '@/Chart/Judgeline';
import { NotePanelBuilder } from './builder';
import './styles.css';

type ItemKeyframe = {
  type: 'keyframe',
  item: ChartKeyframe,
};

type ItemNote = {
  type: 'note',
  item: ChartNote,
};

type Item = ItemKeyframe | ItemNote;

const EditPanel: React.FC = () => {
  const [ selectedItem, ] = useSelectedItem()!;
  const [ line, setLine ] = useState<Nullable<ChartJudgeline>>(null);
  const [ item, setItem ] = useState<Nullable<Item>>(null);

  const handleValueChanged = useCallback((newProp: Record<string, string | number | boolean | BeatArray>) => {
    if (!selectedItem || !line) return;

    if (selectedItem.type === 'keyframe') {
      line.editKeyframe(
        selectedItem.propName,
        selectedItem.id,
        newProp as unknown as TChartKeyframe
      );
    }
  }, [line, selectedItem]);

  useEffect(() => {
    if (!selectedItem) {
      setLine(null);
      setItem(null);
      return;
    }

    const { line, id } = selectedItem;
    setLine(line);
    if (selectedItem.type === 'note') {
      const note = line.findNoteById(id);
      if (!note) return;
      setItem({ type: 'note', item: note });
    } else if (selectedItem.type === 'keyframe') {
      const keyframe = line.findKeyframeById(selectedItem.propName, id);
      if (!keyframe) return;
      setItem({ type: 'keyframe', item: keyframe });
    }
  }, [selectedItem]);

  return (
    <div className="edit-panel">
      {item ? (
        <List
          items={item.type === 'keyframe' ? ([
            {
              label: 'Time',
              type: 'beat',
              key: 'beat',
              props: {
                defaultValue: item.item.beat,
              },
            },
            {
              label: 'Value',
              type: 'number',
              key: 'value',
              props: {
                defaultValue: item.item.value,
              }
            },
            {
              label: 'Continuous',
              type: 'boolean',
              key: 'continuous',
              props: {
                defaultValue: item.item.continuous,
              }
            },
            {
              label: 'Easing',
              type: 'dropdown',
              key: 'easing',
              props: {
                defaultValue: `${item.item.easing}`,
                options: [
                  {
                    label: 'Linear',
                    value: '1',
                  },
                  {
                    label: 'EaseIn',
                    value: '2',
                  },
                  {
                    label: 'EaseOut',
                    value: '3',
                  },
                  {
                    label: 'EaseInOut',
                    value: '4',
                  },
                ]
              },
            }
          ]) : NotePanelBuilder(item.item)}
          onChanged={handleValueChanged}
        />
      ): (
        <div className="edit-panel-placeholder">
          Select an item to edit it.
        </div>
      )}
    </div>
  )
};

export default EditPanel;
