import { createContext, useContext as useContextReact } from 'react';

type RightPanelContextProps = {
  scale: number,
  timeRange: [ number, number ],
};

const RightPanelContext = createContext<RightPanelContextProps>({
  scale: 200,
  timeRange: [ 0, 10 ],
});

export const useContext = () => useContextReact(RightPanelContext);

export default RightPanelContext;
