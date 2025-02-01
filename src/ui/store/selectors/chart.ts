import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { ChartJudglineProps } from '@/Chart/types';

const selectChartState = (state: RootState) => state.chart;

export const selectLineState = createSelector(
  [selectChartState, (_state: RootState, lineID: string) => lineID],
  (chart, lineID) => (
    chart.lines.find((e) => e.id === lineID)
  )
);

export const selectLinePropsState = createSelector(
  [selectChartState, selectLineState],
  (_chart, line) => line?.props,
);

export const selectLinePropState = createSelector(
  [
    selectChartState, selectLineState,
    (_chart: RootState, _lineID: string, type: keyof ChartJudglineProps) => type,
  ],
  (_chart, line, props) => line ? line.props[props] : []
);

export const selectAllLinesState = createSelector(
  [selectChartState],
  (chart) => chart.lines
);

export const selectKeyframeState = createSelector(
  [
    selectChartState, selectLinePropState,
    (_chart: RootState, _lineID: string, _type: keyof ChartJudglineProps, id: string) => id,
  ],
  (_chart, keyframes, id) => keyframes.find((e) => e.id === id)
);
