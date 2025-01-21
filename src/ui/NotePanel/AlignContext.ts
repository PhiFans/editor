import { createContext, useContext } from 'react';

const AlignContext = createContext(8);

export const useAlign = () => useContext(AlignContext);

export default AlignContext;
