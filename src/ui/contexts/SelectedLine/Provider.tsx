import ChartJudgeline from "@/Chart/Judgeline";
import { Nullable } from "@/utils/types";
import { useCallback, useEffect, useState } from "react";
import SelectedLineContext from ".";

type SelectedLineProviderProps = {
  children: React.ReactNode,
};

const SelectedLineProvider = ({
  children
}: SelectedLineProviderProps) => {
  const [ line, setLine ] = useState<Nullable<ChartJudgeline>>(null);

  const unsetLine = useCallback((e: MouseEvent) => {
    if (!line) return;

    const target = e.target as Nullable<HTMLElement>;
    if (!target) return;

    const parentDom = target.parentElement;
    if (!parentDom) return setLine(null);

    if (
      parentDom.closest('.timeline') ||
      parentDom.closest('.note-panel') ||
      parentDom.closest('.edit-panel')
    ) return;
    if (!parentDom.closest('.line-detail')) return setLine(null);
  }, [line]);

  useEffect(() => {
    document.addEventListener('mousedown', unsetLine);
    return (() => {
      document.removeEventListener('mousedown', unsetLine);
    });
  }, [unsetLine]);

  return (
    <SelectedLineContext.Provider value={[ line, setLine ]}>
      {children}
    </SelectedLineContext.Provider>
  )
};

export default SelectedLineProvider;
