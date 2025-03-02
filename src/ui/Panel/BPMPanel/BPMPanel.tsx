import { useCallback, useEffect, useState } from 'react';
import Chart from '@/Chart/Chart';
import ChartBPM from '@/Chart/BPM';
import './styles.css';
import BPMList from './List';
import { BeatArray } from '@/utils/types';
import NumberInput from '@/ui/components/NumberInput';

const BPMPanel = () => {
  const [ defaultOffset, setDefaultOffset ] = useState(0);
  const [ bpmList, setBPMList ] = useState<ChartBPM[]>(Chart.info !== null ? [ ...Chart.bpm ] : []);

  const handleOffsetUpdate = (value: number) => {
    if (!Chart.info) return;
    Chart.offset = value;
  };

  const handleBPMUpdate = useCallback(() => {
    setBPMList([ ...Chart.bpm ]);
  }, []);

  const handleChartSet = useCallback(() => {
    setDefaultOffset(Chart.offset);
    handleBPMUpdate();
  }, [handleBPMUpdate]);

  const handleAddBPM = useCallback(() => {
    if (!Chart.info) return;
    const lastBPM = Chart.bpm[Chart.bpm.length - 1];
    const newBeat: BeatArray = [ ...lastBPM.beat ];
    newBeat[0] += 1;
    Chart.addBPM(newBeat, lastBPM.bpm);
  }, []);

  useEffect(() => {
    Chart.events.on('loaded', handleChartSet);
    Chart.events.on('bpms.updated', handleBPMUpdate);

    return (() => {
      Chart.events.off('loaded', handleChartSet);
      Chart.events.off('bpms.updated', handleBPMUpdate);
    });
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
