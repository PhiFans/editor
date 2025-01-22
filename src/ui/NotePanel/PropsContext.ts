import { createContext, useContext } from 'react';

type PropsContext = {
  align: number,
  scale: number,
  writeMode: boolean,
};

const PropsContext = createContext<PropsContext>({
  align: 8,
  scale: 200,
  writeMode: false,
});

export const useProps = () => useContext(PropsContext);

export default PropsContext;
