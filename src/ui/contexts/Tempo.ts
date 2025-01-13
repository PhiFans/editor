import { createContext, useContext } from 'react';

const TempoContext = createContext<number>(4);

export const useTempo = () => useContext(TempoContext);

export default TempoContext;
