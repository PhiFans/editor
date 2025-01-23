import { createContext, useContext } from 'react';
import { NoteType } from '@/Chart/types';
import { Nullable } from '@/utils/types';

type PropsContext = {
  align: number,
  scale: number,
  writeMode: Nullable<NoteType>,
};

const PropsContext = createContext<PropsContext>({
  align: 8,
  scale: 200,
  writeMode: null,
});

export const useProps = () => useContext(PropsContext);

export default PropsContext;
