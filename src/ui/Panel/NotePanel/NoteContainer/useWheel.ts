import { useCallback, useMemo } from 'react';
import Chart from '@/Chart/Chart';
import { useTempo } from '@/ui/contexts/Tempo';
import { GridValue } from '@/utils/math';

const useWheel = () => {
  const tempo = useTempo();
  const tempoGrid = useMemo(() => 1 / tempo, [tempo]);

  const handleWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    if (!Chart.info) return;

    const { deltaY, shiftKey } = e;
    const seekFactor = deltaY > 0 ? 1 : -1;
    const newTime = GridValue(Chart.beatNum + ((shiftKey ? 1 : tempoGrid) * seekFactor), tempoGrid);

    Chart.beatNum = newTime;
  }, [tempoGrid]);

  return {
    onWheel: handleWheel,
  };
};

export default useWheel;
