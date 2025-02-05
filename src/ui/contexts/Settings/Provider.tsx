import { useEffect, useState } from 'react';
import Settings from '@/Settings/Settings';
import SettingsContext from '.';
import { TSettings } from '@/Settings/types';

type SettingsProviderProps = {
  children: React.ReactNode,
};

const SettingsProvider = ({
  children
}: SettingsProviderProps) => {
  const [ settings, setSettings ] = useState(Settings.current);

  useEffect(() => {
    const updateSettings = (newSettings: TSettings) => {
      setSettings(newSettings);
    };

    Settings.event.on('settings.updated', updateSettings);
    return (() => {
      Settings.event.off('settings.updated', updateSettings);
    });
  }, []);

  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  )
};

export default SettingsProvider;
