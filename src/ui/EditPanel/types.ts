
export type PanelItemPropsBase<T> = {
  label: string,
  onChanged: (newValue: T) => void,
  defaultValue?: T,
};
