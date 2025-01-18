import { useCallback, useEffect, useState } from 'react';
import { Ticker } from 'pixi.js';
import App from '@/App/App';
import TimeContext from '.';

type TimeContextProviderProps = {
  children: React.ReactNode;
}

const TimeContextProvider = ({
  children
}: TimeContextProviderProps) => {
  const [ time, setTime ] = useState(0);

  const updateTime = useCallback(() => {
    if (!App.chart) return;
    setTime(App.chart.beatNum);
  }, []);

  useEffect(() => {
    const ticker = Ticker.shared;
    ticker.add(updateTime);
    return (() => {
      ticker.remove(updateTime);
    });
  }, [updateTime]);

  return (
    <TimeContext.Provider value={time}>
      {children}
    </TimeContext.Provider>
  )
};

export default TimeContextProvider;
