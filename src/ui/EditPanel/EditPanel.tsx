import { useCallback, useEffect, useState } from 'react';
import { useSelectedItem } from '../contexts/SelectedItem';
import List from './List';
import { Nullable } from '@/utils/types';
import ChartKeyframe, { TChartKeyframe } from '@/Chart/Keyframe';
import ChartNote from '@/Chart/Note';
import ChartJudgeline from '@/Chart/Judgeline';
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

  const handleValueChanged = useCallback((newProp: Record<string, string | number | boolean>) => {
    if (!selectedItem || !line) return;

    if (selectedItem.type === 'keyframe') {
      line.editKeyframe(
        selectedItem.propName,
        selectedItem.index,
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

    const { line, index } = selectedItem;
    setLine(line);
    if (selectedItem.type === 'note') {
      const note = line.notes[index];
      setItem({ type: 'note', item: note });
    } else if (selectedItem.type === 'keyframe') {
      const prop = line.props[selectedItem.propName];
      const keyframe = prop[index];
      setItem({ type: 'keyframe', item: keyframe });
    }
  }, [selectedItem]);

  return (
    <div className="edit-panel">
      {item ? (
        <List
          items={item.type === 'keyframe' ? ([
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
          ]) : ([

          ])}
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
