import { useCallback, useEffect, useState } from 'react';
import App from '@/App/App';
import ChartBPM from '@/Chart/BPM';
import './styles.css';
import BPMList from './List';
import { BeatArray } from '@/utils/types';
import NumberInput from '@/ui/components/NumberInput';

const BPMPanel = () => {
  const [ defaultOffset, setDefaultOffset ] = useState(0);
  const [ bpmList, setBPMList ] = useState<ChartBPM[]>(App.chart ? [ ...App.chart.bpm ] : []);

  const handleOffsetUpdate = (value: number) => {
    if (!App.chart) return;
    App.chart.offset = value;
  };

  const handleBPMUpdate = useCallback(() => {
    setBPMList([ ...App.chart!.bpm ]);
  }, []);

  const handleChartSet = useCallback(() => {
    setDefaultOffset(App.chart!.offset);
    handleBPMUpdate();
  }, [handleBPMUpdate]);

  const handleAddBPM = useCallback(() => {
    if (!App.chart) return;
    const lastBPM = App.chart.bpm[App.chart.bpm.length - 1];
    const newBeat: BeatArray = [ ...lastBPM.beat ];
    newBeat[0] += 1;
    App.chart.addBPM(newBeat, lastBPM.bpm);
  }, []);

  useEffect(() => {
    App.events.on('chart.set', handleChartSet);
    App.events.on('chart.bpms.updated', handleBPMUpdate);

    return (() => {
      App.events.off('chart.set', handleChartSet);
      App.events.off('chart.bpms.updated', handleBPMUpdate);
    })
  }, [handleChartSet, handleBPMUpdate]);

  return (
    <div className='bpm-panel'>
      <div className='bpm-offset'>
        <div className='bpm-prop'>
          <div className='bpm-prop-name'>Offset</div>
          <div className='bpm-prop-input'>
            <NumberInput
              step={1}
              defaultValue={defaultOffset}
              onChanged={handleOffsetUpdate}
            />
          </div>
        </div>
      </div>
      <BPMList bpms={bpmList} />
      <div className='bpm-panel-actions'>
        <button onClick={handleAddBPM}>Add BPM</button>
      </div>
    </div>
  );
};

export default BPMPanel;
