import { ChartBPMExported } from "../BPM";
import { ChartJudgelineExported } from "../Judgeline";
import { TChartJudgelineProps } from "../JudgelineProps";
import { ChartKeyframeExported } from "../Keyframe";
import { ChartNoteExported } from "../Note";


export type HistoryBaseAdd<T> = {
  id: string,
  action: 'add',
  after: Partial<T>,
};

export type HistoryBaseEdit<T> = {
  id: string,
  action: 'edit',
  before: Partial<T>,
  after: Partial<T>,
};

export type HistoryBaseDelete<T> = {
  id: string,
  action: 'delete',
  before: Partial<T>,
};

export type HistoryBase<T> = HistoryBaseAdd<T> | HistoryBaseEdit<T> | HistoryBaseDelete<T>;


export type HistoryBPM = HistoryBase<ChartBPMExported> & {
  name: 'bpm',
};

export type HistoryLine = HistoryBase<ChartJudgelineExported> & {
  name: 'line',
};

export type HistoryKeyframe = HistoryBase<ChartKeyframeExported> & {
  name: 'keyframe',
  type: keyof TChartJudgelineProps,
  lineID: string,
};

export type HistoryNote = HistoryBase<ChartNoteExported> & {
  name: 'note',
  lineID: string,
};

export type HistoryType = HistoryBPM | HistoryLine | HistoryKeyframe | HistoryNote;
