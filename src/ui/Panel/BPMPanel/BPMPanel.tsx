import { useCallback, useEffect, useState } from 'react';
import App from '@/App/App';
import ChartBPM from '@/Chart/BPM';
import './styles.css';
import BPMList from './List';
import { BeatArray } from '@/utils/types';

const BPMPanel = () => {
  const [ bpmList, setBPMList ] = useState<ChartBPM[]>(App.chart ? [ ...App.chart.bpm ] : []);

  const handleBPMUpdate = useCallback(() => {
    setBPMList([ ...App.chart!.bpm ]);
  }, []);

  const handleAddBPM = useCallback(() => {
    if (!App.chart) return;
    const lastBPM = App.chart.bpm[App.chart.bpm.length - 1];
    const newBeat: BeatArray = [ ...lastBPM.beat ];
    newBeat[0] += 1;
    App.chart.addBPM(newBeat, lastBPM.bpm);
  }, []);

  useEffect(() => {
    App.events.on('chart.set', handleBPMUpdate);
    App.events.on('chart.bpms.updated', handleBPMUpdate);

    return (() => {
      App.events.off('chart.set', handleBPMUpdate);
      App.events.off('chart.bpms.updated', handleBPMUpdate);
    })
  }, [handleBPMUpdate]);

  return (
    <div className='bpm-panel'>
      <BPMList bpms={bpmList} />
      <div className='bpm-panel-actions'>
        <button onClick={handleAddBPM}>Add BPM</button>
      </div>
    </div>
  );
};

export default BPMPanel;
