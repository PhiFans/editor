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

  useEffect(() => {
    const ticker = Ticker.shared;
    const updateTime = () => {
      if (!App.chart) return;
      setTime(App.chart.time);
    };
    ticker.add(updateTime);

    return (() => {
      ticker.remove(updateTime);
    });
  }, []);

  return <ClockTimeContext.Provider value={time}>
    {children}
  </ClockTimeContext.Provider>
};

export default ClockTimeProvider;
