import { useEffect, useState } from 'react';
import { Ticker } from 'pixi.js';
import ClockTimeContext from '.';
import App from '@/App/App';

export type ClockTimeProviderProps = {
  children: React.ReactNode,
};

const ClockTimeProvider: React.FC<ClockTimeProviderProps> = ({
  children
}: ClockTimeProviderProps) => {
  const [ time, setTime ] = useState(0);
  const [ beat, setBeat ] = useState(0);

  useEffect(() => {
    const ticker = Ticker.shared;
    const updateTime = () => {
      if (!App.chart) return;
      setTime(App.chart.time);
      setBeat(App.chart.beatNum);
    };
    ticker.add(updateTime);

    return (() => {
      ticker.remove(updateTime);
    });
  }, []);

  return <ClockTimeContext.Provider value={{
    time: time,
    beat: beat,
  }}>
    {children}
  </ClockTimeContext.Provider>
};

export default ClockTimeProvider;
