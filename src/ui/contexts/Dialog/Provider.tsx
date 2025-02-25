import { useState } from 'react';
import DialogContext from '.';
import { $DialogProps } from './types';
import { Dialog } from '@blueprintjs/core';

type DialogProviderProps = {
  children: React.ReactNode,
};

const DialogProvider = ({
  children
}: DialogProviderProps) => {
  const [ dialogProps, setDialogProps ] = useState<$DialogProps>({});
  const [ isOpen, setIsOpen ] = useState(false);

  const openDialog = () => setIsOpen(true);
  const closeDialog = () => setIsOpen(false);

  const showDialog = (props: $DialogProps) => {
    setDialogProps(props);
    openDialog();
  };

  return (
    <DialogContext.Provider value={{
      show: showDialog,
      close: closeDialog,
    }}>
      {children}
      <Dialog
        onClose={closeDialog}
        {...dialogProps}
        isOpen={isOpen}
      />
    </DialogContext.Provider>
  )
};

export default DialogProvider;
