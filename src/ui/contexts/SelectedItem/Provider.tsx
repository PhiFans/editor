import { useState } from 'react';
import SelectedItemContext from '.';
import { SelectedItem } from '.';
import { Nullable } from '@/utils/types';

type SelectedItemProviderProps = {
  children: React.ReactNode,
};

const SelectedItemProvider = ({
  children
}: SelectedItemProviderProps) => {
  const [ item, setItem ] = useState<Nullable<SelectedItem>>(null);

  return (
    <SelectedItemContext.Provider value={[ item, setItem ]}>
      {children}
    </SelectedItemContext.Provider>
  );
};

export default SelectedItemProvider;
