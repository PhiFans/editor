import { createContext, useContext } from 'react';
import { $DialogProps, DialogContextProps } from './types';

const uninitFn = (props: $DialogProps) => void props;

const DialogContext = createContext<DialogContextProps>({
  show: uninitFn,
  close: () => void 0,
});

export const useDialog = () => useContext(DialogContext);
export default DialogContext;
