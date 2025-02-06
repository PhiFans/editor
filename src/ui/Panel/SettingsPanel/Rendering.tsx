import { CardList, Slider } from '@blueprintjs/core';
import Settings from '@/Settings/Settings';
import Item from './Item';
import { useSettings } from '@/ui/contexts/Settings';

const SettingsRendering = () => {
  const settings = useSettings();

  const updateNoteScale = (value: number) => {
    const newValue = 10000 - value * 4000;
    Settings.set('noteScale', newValue);
  };

  return (
    <CardList compact>
        <Item
          label='Note scale'
        >
          <Slider
            min={0}
            max={1}
            stepSize={0.01}
            value={(10000 - settings.noteScale) / 4000}
            onChange={updateNoteScale}
            labelRenderer={false}
          />
        </Item>
      </CardList>
  );
};

export default SettingsRendering;
