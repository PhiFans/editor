import { useEffect, useState } from 'react';
import { Ticker } from 'pixi.js';
import ClockTimeContext from '.';
import Chart from '@/Chart/Chart';

export type ClockTimeProviderProps = {
  children: React.ReactNode,
};

const ClockTimeProvider: React.FC<ClockTimeProviderProps> = ({
  children
}: ClockTimeProviderProps) => {
  const [ time, setTime ] = useState(0);
  const [ beat, setBeat ] = useState(0);
  const [ beatOffset, setBeatOffset ] = useState(0);

  useEffect(() => {
    const ticker = Ticker.shared;
    const updateTime = () => {
      setTime(Chart.time);
      setBeat(Chart.beatNum);
      setBeatOffset(Chart.offsetBeat);
    };
    ticker.add(updateTime);

    return (() => {
      ticker.remove(updateTime);
    });
  }, []);

  return <ClockTimeContext.Provider value={{
    time: time,
    beat: beat,
    beatOffset: beatOffset,
  }}>
    {children}
  </ClockTimeContext.Provider>
};

export default ClockTimeProvider;
