import { DialogProps } from '@blueprintjs/core';

export type $DialogProps = Omit<DialogProps, 'isOpen'>;

export type DialogContextProps = {
  show: (props: $DialogProps) => void,
  close: () => void,
};
