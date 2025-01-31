import { CaseReducer, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {v4 as uuid } from 'uuid';
import { Nullable } from '@/utils/types';

export type ChartType = {
  bpm: ChartBPMType[],
  lines: ChartLineType[],

  selectedLineID: Nullable<string>,
  selectedNoteID: Nullable<string>,
};

export type ChartBPMType = {
  id: string,
  time: number,
  bpm: number,
};

export type ChartLineType = {
  id: string,
  notes: ChartNoteType[],
}

export type ChartNoteType = {
  id: string,
  time: number,
};

const initialState: ChartType = {
  bpm: [],
  lines: [],

  selectedLineID: null,
  selectedNoteID: null,
};

const addLineReducer: CaseReducer<ChartType> = (state) => {
  const newLine: ChartLineType = {
    id: uuid(),
    notes: [],
  };
  state.lines.push(newLine);
  state.selectedLineID = newLine.id;
};

const removeLineReducer: CaseReducer<ChartType, PayloadAction<string>> = (state, action) => {
  const lineID = action.payload;
  state.lines = state.lines.filter((e) => e.id !== lineID);
  if (state.selectedLineID === lineID) state.selectedLineID = null;
};

const chartSlice = createSlice({
  name: 'chart',
  initialState,
  reducers: {
    addLine: addLineReducer,
    removeLine: removeLineReducer,
  },
});

export const {
  addLine,
  removeLine
} = chartSlice.actions;
export default chartSlice.reducer;
