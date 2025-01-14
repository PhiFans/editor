import { createContext, useContext } from 'react';
import ChartKeyframe from '@/Chart/Keyframe';
import ChartNote from '@/Chart/Note';
import { Nullable } from '@/utils/types';

export type SelectedItem = ChartKeyframe | ChartNote;
export type TSelectedItemContext = Nullable<
  [ Nullable<SelectedItem>, React.Dispatch<React.SetStateAction<Nullable<SelectedItem>>> ]
>;

const SelectedItemContext = createContext<TSelectedItemContext>(null);

export const useSelectedItem = () => useContext(SelectedItemContext);

export default SelectedItemContext;
