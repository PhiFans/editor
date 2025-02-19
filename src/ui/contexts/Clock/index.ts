import { createContext, useContext } from 'react';

type ClockTime = {
  time: number,
  beat: number,
  beatOffset:number,
};

const ClockTimeContext = createContext<ClockTime>({ time: 0, beat: 0, beatOffset: 0 });

export const useClockTime = () => useContext(ClockTimeContext);

export default ClockTimeContext;
