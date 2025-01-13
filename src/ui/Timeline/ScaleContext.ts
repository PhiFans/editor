import { createContext, useContext } from 'react';

const ScaleContext = createContext<number>(205);

export const useScale = () => useContext(ScaleContext);

export default ScaleContext;
