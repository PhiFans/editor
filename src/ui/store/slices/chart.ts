import { CaseReducer, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {v4 as uuid } from 'uuid';
import { BeatArray, Nullable } from '@/utils/types';
import { Chart, ChartNote, ChartJudgeline, NoteType, ChartKeyframe, ChartJudglineProps } from '@/Chart/types';

type ChartState = Chart & {
  selectedLineID: Nullable<string>,
  selectedNoteID: Nullable<string>,
};

/* ======================= Reducers ======================= */
const addLineReducer: CaseReducer<ChartState> = (state) => {
  const lineID = uuid();
  const newLine: ChartJudgeline = {
    id: lineID,
    notes: [],
    props: {
      speed: [{
        id: uuid(),
        lineID,
        time: [0, 0, 1],
        value: 1,
        continuous: false,
        easing: 0,
      }],
      positionX: [{
        id: uuid(),
        lineID,
        time: [0, 0, 1],
        value: 0,
        continuous: false,
        easing: 0,
      }],
      positionY: [{
        id: uuid(),
        lineID,
        time: [0, 0, 1],
        value: 0,
        continuous: false,
        easing: 0,
      }],
      rotate: [{
        id: uuid(),
        lineID,
        time: [0, 0, 1],
        value: 0,
        continuous: false,
        easing: 0,
      }],
      alpha: [{
        id: uuid(),
        lineID,
        time: [0, 0, 1],
        value: 255,
        continuous: false,
        easing: 0,
      }]
    },
  };

  state.lines.push(newLine);
  state.selectedLineID = newLine.id;
};

const removeLineReducer: CaseReducer<ChartState, PayloadAction<string>> = (state, action) => {
  const lineID = action.payload;
  state.lines = state.lines.filter((e) => e.id !== lineID);
  if (state.selectedLineID === lineID) state.selectedLineID = null;
};

const selectLineReducer: CaseReducer<ChartState, PayloadAction<string>> = (state, action) => {
  const lineID = action.payload;
  const line = state.lines.find((e) => e.id === lineID);
  if (!line) return;
  state.selectedLineID = lineID;
};

const unselectLineReducer: CaseReducer<ChartState> = (state) => {
  state.selectedLineID = null;
};

const addKeyframeReducer: CaseReducer<ChartState, PayloadAction<Omit<ChartKeyframe, 'id'> & { type: keyof ChartJudglineProps }>> = (state, action) => {
  console.log('addKeyframe');
  const { lineID, type, time, value, continuous, easing } = action.payload;
  const line = state.lines.find((e) => e.id === lineID);
  if (!line) return;

  const newKeyframe: ChartKeyframe = {
    id: uuid(),
    lineID: line.id,
    time,
    value,
    continuous,
    easing,
  };

  line.props[type].push(newKeyframe);
};

const editKeyframeReducer: CaseReducer<ChartState, PayloadAction<Partial<ChartKeyframe> & { lineID: string, type: keyof ChartJudglineProps, id: string }>> = (state, action) => {
  const { lineID, type, id } = action.payload;
  const line = state.lines.find((e) => e.id === lineID);
  if (!line) return;

  const keyframe = line.props[type].find((e) => e.id === id);
  if (!keyframe) return;

  for (const name in action.payload) {
    if (
      name === 'lineID' ||
      name === 'type' ||
      name === 'id'
    ) continue;

    // XXX: This sucks
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    keyframe[name] = action.payload[name];
  }
};

const removeKeyframeReducer: CaseReducer<ChartState, PayloadAction<{ lineID: string, type: keyof ChartJudglineProps, id: string }>> = (state, action) => {
  const { lineID, type, id } = action.payload;
  const line = state.lines.find((e) => e.id === lineID);
  if (!line) return;

  const props = line.props[type];
  if (props.findIndex((e) => e.id === id) === -1) return;

  line.props[type] = props.filter((e) => e.id !== id);
};

const addNoteReducer: CaseReducer<ChartState, PayloadAction<Omit<ChartNote, 'id'> & { holdEndTime?: BeatArray }>> = (state, action) => {
  const noteProps = action.payload;
  const { lineID } = noteProps;

  const line = state.lines.find((e) => e.id === lineID);
  if (!line) return;

  const newNote: ChartNote = {
    id: uuid(),
    lineID: line.id,
    time: noteProps.time,
    type: noteProps.type,
    speed: noteProps.speed,
    isAbove: noteProps.isAbove,
    holdEndTime: noteProps.type === NoteType.HOLD ? noteProps.holdEndTime : noteProps.time,
  };

  line.notes.push(newNote);
  state.notes.push(newNote);
  state.selectedNoteID = newNote.id;
};

const removeNoteReducer: CaseReducer<ChartState, PayloadAction<string>> = (state, action) => {
  const noteID = action.payload;
  const note = state.notes.find((e) => e.id === noteID);
  if (!note) return;

  const line = state.lines.find((e) => e.id === note.lineID);
  if (!line) return;

  line.notes.filter((e) => e.id !== note.id);
  state.notes.filter((e) => e.id !== note.id);
  if (state.selectedNoteID === note.id) state.selectedNoteID = null;
};

const selectNoteReducer: CaseReducer<ChartState, PayloadAction<string>> = (state, action) => {
  const noteID = action.payload;
  const note = state.notes.find((e) => e.id === noteID);
  if (!note) return;

  state.selectedNoteID = noteID;
};

const unselectNoteReducer: CaseReducer<ChartState> = (state) => {
  state.selectedNoteID = null;
};

const initialState: ChartState = {
  bpms: [],
  lines: [],
  notes: [],

  selectedLineID: null,
  selectedNoteID: null,
};

const chartSlice = createSlice({
  name: 'chart',
  initialState,
  reducers: {
    addLine: addLineReducer,
    removeLine: removeLineReducer,
    selectLine: selectLineReducer,
    unselectLine: unselectLineReducer,

    addKeyframe: addKeyframeReducer,
    editKeyframe: editKeyframeReducer,
    removeKeyframe: removeKeyframeReducer,

    addNote: addNoteReducer,
    removeNote: removeNoteReducer,
    selectNote: selectNoteReducer,
    unselectNote: unselectNoteReducer,
  },
});

export const {
  addLine,
  removeLine,
  selectLine,
  unselectLine,

  addKeyframe,
  editKeyframe,
  removeKeyframe,

  addNote,
  removeNote,
  selectNote,
  unselectNote,
} = chartSlice.actions;
export default chartSlice.reducer;
