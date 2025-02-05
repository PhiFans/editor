import { useMemo } from 'react';
import App from '@/App/App';
import { useTempo } from '../../contexts/Tempo';
import { GridValue } from '@/utils/math';

const PreviewController = () => {
  const tempo = useTempo();
  const tempoGrid = useMemo(() => 1 / tempo, [tempo]);

  return (
    <>
      <div className="progress-bar">
        <input
          type='range'
          defaultValue={0}
          min={0}
          max={0}
        />
      </div>
      <div className="control-actions">
        <div className="control-group control-group-center">
          <button
            onClick={() => {
              if (!App.chart) return;
              App.chart.beatNum = GridValue(App.chart.beatNum - 1, 1);
            }}
          >Prev beat</button>
          <button
            onClick={() => {
              if (!App.chart) return;
              App.chart.beatNum = GridValue(App.chart.beatNum - tempoGrid, tempoGrid);
            }}
          >Prev tempo</button>
          <button
            onClick={() => {
              if (!App.chart) return;
              App.chart.playOrPause().catch(() => void 0);
            }}
          >Play/Pause</button>
          <button
            onClick={() => {
              if (!App.chart) return;
              App.chart.beatNum = GridValue(App.chart.beatNum + tempoGrid, tempoGrid);
            }}
          >Next tempo</button>
          <button
            onClick={() => {
              if (!App.chart) return;
              App.chart.beatNum = GridValue(App.chart.beatNum + 1, 1);
            }}
          >Next beat</button>
        </div>
      </div>
    </>
  );
};

export default PreviewController;
