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
  const [ item, setItem ] = useState<SelectedItem>(null);

  const unsetItem = useCallback((e: MouseEvent) => {
    if (!item) return;

    const target = e.target as Nullable<HTMLElement>;
    if (!target) return;
    if (target.closest('.timeline-panel-head-right')) return;

    const parentDom = target.parentElement;
    if (parentDom) {
      if (
        parentDom.closest('.timeline-time-seeker') ||
        parentDom.closest('.edit-panel') ||
        parentDom.closest('.note-panel')
      ) return;
    }

    if (!target.classList.contains('timeline-content-key')) return setItem(null);
  }, [item]);

  useEffect(() => {
    document.addEventListener('mousedown', unsetItem);
    return (() => {
      document.removeEventListener('mousedown', unsetItem);
    });
  }, [unsetItem]);

  return (
    <SelectedItemContext.Provider value={[ item, setItem ]}>
      {children}
    </SelectedItemContext.Provider>
  );
};

export default SelectedItemProvider;
