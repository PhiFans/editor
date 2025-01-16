import { createContext, useContext } from "react";

const RangeContext = createContext<[number, number]>([0, Infinity]);

export const useRange = () => useContext(RangeContext);

export default RangeContext;
