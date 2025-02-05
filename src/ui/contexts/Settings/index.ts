import { createContext, useContext } from 'react';
import Settings from '@/Settings/Settings';

const settingsContext = createContext(Settings.current);

export const useSettings = () => useContext(settingsContext);

export default settingsContext;
