import { useMemo } from 'react';
import Chart from '@/Chart/Chart';
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
              if (!Chart.info) return;
              Chart.beatNum = GridValue(Chart.beatNum - 1, 1);
            }}
          >Prev beat</button>
          <button
            onClick={() => {
              if (!Chart.info) return;
              Chart.beatNum = GridValue(Chart.beatNum - tempoGrid, tempoGrid);
            }}
          >Prev tempo</button>
          <button
            onClick={() => {
              if (!Chart.info) return;
              Chart.playOrPause().catch(() => void 0);
            }}
          >Play/Pause</button>
          <button
            onClick={() => {
              if (!Chart.info) return;
              Chart.beatNum = GridValue(Chart.beatNum + tempoGrid, tempoGrid);
            }}
          >Next tempo</button>
          <button
            onClick={() => {
              if (!Chart.info) return;
              Chart.beatNum = GridValue(Chart.beatNum + 1, 1);
            }}
          >Next beat</button>
        </div>
      </div>
    </>
  );
};

export default PreviewController;
