import { Button, Menu, Popover } from '@blueprintjs/core';
import CreateProject from './CreateProject';

const MenuFile = () => {
  return (
    <Popover
      content={(
        <Menu>
          <CreateProject />
        </Menu>
      )}
      usePortal={false}
      lazy={true}
      minimal
    >
      <Button text='File' minimal />
    </Popover>
  )
};

export default MenuFile;
