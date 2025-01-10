import { createContext, useContext } from 'react';

const ClockTimeContext = createContext<number>(0);

export const useClockTime = () => useContext(ClockTimeContext);

export default ClockTimeContext;
