import { useCallback } from "react";
import InputBoolean, { BooleanProps } from "./Item/Boolean";
import InputDropdown, { DropdownProps } from "./Item/Dropdown";
import InputNumber, { NumberProps } from "./Item/Number";
import { StringProps } from "./Item/String";
import InputBeat, { BeatProps } from "./Item/Beat";
import { BeatArray } from "@/utils/types";

type PropsMovedDefault = 'label' | 'onChanged';

type EditPanelItemBase = {
  key: string,
  label: string,
  type: 'number' | 'string' | 'boolean' | 'dropdown' | 'beat',
};

type EditPanelItemNumber = EditPanelItemBase & {
  type: 'number',
  props: Omit<NumberProps, PropsMovedDefault>,
}

type EditPanelItemString = EditPanelItemBase & {
  type: 'string',
  props: Omit<StringProps, PropsMovedDefault>,
};

type EditPanelItemBoolean = EditPanelItemBase & {
  type: 'boolean',
  props: Omit<BooleanProps, PropsMovedDefault>,
};

type EditPanelItemDropdown = EditPanelItemBase & {
  type: 'dropdown',
  props: Omit<DropdownProps, PropsMovedDefault>,
};

type EditPanelItemBeat = EditPanelItemBase & {
  type: 'beat',
  props: Omit<BeatProps, PropsMovedDefault>,
};

export type EditPanelItem = EditPanelItemNumber | EditPanelItemString | EditPanelItemBoolean | EditPanelItemDropdown | EditPanelItemBeat;

type EditPanelListProps = {
  items: EditPanelItem[],
  onChanged: (newProp: Record<string, string | number | boolean | BeatArray>) => void,
};

const EditPanelList = ({
  items,
  onChanged,
}: EditPanelListProps) => {
  const handleValueChanged = useCallback((key: string, value: string | number | boolean | BeatArray) => {
    const newProp: Record<string, string | number | boolean | BeatArray> = {};
    newProp[key] = value;

    if (key === 'easing') newProp[key] = parseInt(value as string);
    onChanged(newProp);
  }, [onChanged]);

  return (
    <div className="edit-panel-list">
      {items.map((item) => {
        if (item.type === 'beat') return (
          <InputBeat label={item.label} {...item.props} onChanged={(e) => handleValueChanged(item.key, e)} key={item.key} />
        );
        if (item.type === 'number') return (
          <InputNumber label={item.label} {...item.props} onChanged={(e) => handleValueChanged(item.key, e)} key={item.key} />
        );
        if (item.type === 'boolean') return (
          <InputBoolean label={item.label} {...item.props} onChanged={(e) => handleValueChanged(item.key, e)} key={item.key} />
        );
        if (item.type === 'dropdown') return (
          <InputDropdown label={item.label} {...item.props} onChanged={(e) => handleValueChanged(item.key, e)} key={item.key} />
        );
        return null;
      })}
    </div>
  );
};

export default EditPanelList;
