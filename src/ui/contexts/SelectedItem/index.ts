import { createContext, useContext } from 'react';
import { Nullable } from '@/utils/types';
import ChartJudgeline from '@/Chart/Judgeline';
import { TChartJudgelineProps } from '@/Chart/JudgelineProps';

export type SelectedItemBase = {
  type: 'keyframe' | 'note',
  line: ChartJudgeline,
  id: string,
};

export type SelectedItemKeyframe = SelectedItemBase & {
  type: 'keyframe',
  propName: keyof TChartJudgelineProps,
};

export type SelectedItemNote = SelectedItemBase & {
  type: 'note',
};

export type SelectedItem = SelectedItemKeyframe | SelectedItemNote;

export type TSelectedItemContext = Nullable<
  [ Nullable<SelectedItem>, React.Dispatch<React.SetStateAction<Nullable<SelectedItem>>> ]
>;

const SelectedItemContext = createContext<TSelectedItemContext>(null);

export const useSelectedItem = () => useContext(SelectedItemContext);

export default SelectedItemContext;
