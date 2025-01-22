import { useCallback, useEffect, useState } from 'react';
import { useSelectedItem } from '../contexts/SelectedItem';
import List from './List';
import { BeatArray, Nullable } from '@/utils/types';
import ChartKeyframe, { TChartKeyframe } from '@/Chart/Keyframe';
import ChartNote, { ChartNoteProps } from '@/Chart/Note';
import { KeyframePanelBuilderSingle, NotePanelBuilderSingle } from './builder';
import { TChartJudgelineProps } from '@/Chart/JudgelineProps';
import './styles.css';


type ItemKeyframeSub = {
  type: keyof TChartJudgelineProps,
  keyframe: ChartKeyframe,
}

type ItemKeyframe = {
  type: 'keyframe',
  item: ItemKeyframeSub | ItemKeyframeSub[],
};

type ItemNote = {
  type: 'note',
  item: ChartNote | ChartNote[],
};

type Item = ItemKeyframe | ItemNote;

const EditPanel: React.FC = () => {
  const [ selectedItem, ] = useSelectedItem()!;
  const [ item, setItem ] = useState<Nullable<Item>>(null);

  const handleValueChanged = useCallback((newProp: Record<string, string | number | boolean | BeatArray>) => {
    if (!selectedItem || !item) return;

    const { line } = selectedItem;
    if (item.type === 'note') {
      if (item.item instanceof Array) {
        // TODO: Multi note edit
      } else {
        if (newProp['type']) newProp['type'] = parseInt(newProp['type'] as string);
        if (newProp['positionX']) newProp['positionX'] = (newProp['positionX'] as number) / 100;

        line.editNote(
          item.item.id,
          newProp as unknown as ChartNoteProps
        );
      }
    }

    if (item.type === 'keyframe') {
      if (item.item instanceof Array) {
        // TODO: Multi keyframe edit
      } else {
        line.editKeyframe(
          item.item.type,
          item.item.keyframe.id,
          newProp as unknown as TChartKeyframe
        );
      }
    }
  }, [item, selectedItem]);

  useEffect(() => {
    if (!selectedItem) {
      setItem(null);
      return;
    }

    const { line } = selectedItem;

    if (selectedItem.keyframe !== null) {
      if (selectedItem.keyframe instanceof Array) {
        // TODO: Multi keyframe edit
      } else {
        const keyframe = line.findKeyframeById(selectedItem.keyframe.type, selectedItem.keyframe.id);
        if (!keyframe) return;
        setItem({
          type: 'keyframe',
          item: {
            type: selectedItem.keyframe.type,
            keyframe,
          },
        });
      }
    }

    if (selectedItem.note !== null) {
      if (selectedItem.note instanceof Array) {
        // TODO: Multi note edit
      } else {
        const note = line.findNoteById(selectedItem.note.id);
        if (!note) return;
        setItem({ type: 'note', item: note });
      }
    }
  }, [selectedItem]);

  return (
    <div className="edit-panel">
      {item ? (
        <List
          items={(
            (item.item instanceof Array) ? (
              []
            ) : (
              item.type === 'note' ? (
                NotePanelBuilderSingle(item.item)
              ) : (
                KeyframePanelBuilderSingle(item.item.keyframe)
              )
            )
          )}
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
