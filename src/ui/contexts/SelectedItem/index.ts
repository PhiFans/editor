import { createContext, useContext } from 'react';
import { Nullable } from '@/utils/types';
import ChartJudgeline from '@/Chart/Judgeline';
import { TChartJudgelineProps } from '@/Chart/JudgelineProps';

export type SelectedKeyframe = {
  type: keyof TChartJudgelineProps,
  id: string,
};

export type SelectedNote = {
  id: string,
};

export type SelectedItem = Nullable<{
  line: ChartJudgeline,
  keyframe: Nullable<SelectedKeyframe | SelectedKeyframe[]>,
  note: Nullable<SelectedNote | SelectedNote[]>,
}>;

export type TSelectedItemContext = Nullable<
  [ SelectedItem, React.Dispatch<React.SetStateAction<SelectedItem>> ]
>;

const SelectedItemContext = createContext<TSelectedItemContext>(null);

export const useSelectedItem = () => useContext(SelectedItemContext);

export default SelectedItemContext;
