import { useCallback, useEffect, useState } from 'react';
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

  const unsetItem = useCallback((e: MouseEvent) => {
    if (!item) return;

    const target = e.target as Nullable<HTMLElement>;
    if (!target) return;

    const parentDom = target.parentElement;
    if (parentDom) {
      if (parentDom.closest('.edit-panel')) return;
    }

    if (!target.classList.contains('timeline-content-key')) return setItem(null);
  }, [item]);

  useEffect(() => {
    document.addEventListener('click', unsetItem);
    return (() => {
      document.removeEventListener('click', unsetItem);
    });
  }, [unsetItem]);

  return (
    <SelectedItemContext.Provider value={[ item, setItem ]}>
      {children}
    </SelectedItemContext.Provider>
  );
};

export default SelectedItemProvider;
