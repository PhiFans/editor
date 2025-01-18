import { createContext, useContext } from 'react';

const TimeContext = createContext<number>(0);

export const useTime = () => useContext(TimeContext);

export default TimeContext;
