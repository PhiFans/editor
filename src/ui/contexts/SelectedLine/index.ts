import { createContext, useContext } from 'react';
import ChartJudgeline from '@/Chart/Judgeline';
import { Nullable } from '@/utils/types';

export type TSelectedLineContext = Nullable<
  [ Nullable<ChartJudgeline>, React.Dispatch<React.SetStateAction<Nullable<ChartJudgeline>>> ]
>;

const SelectedLineContext = createContext<TSelectedLineContext>(null);

export const useSelectedLine = () => useContext(SelectedLineContext);

export default SelectedLineContext;
