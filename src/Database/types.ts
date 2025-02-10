import { ChartInfo } from '@/Chart/types';

export type TProject = ChartInfo & {
  id: string,
  filesID: string,
  chartID: string,
  musicID: string,
  backgroundID: string,
};
