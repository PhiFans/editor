import { useCallback, useMemo } from 'react';
import App from '@/App/App';
import { useTempo } from '@/ui/contexts/Tempo';
import { GridValue } from '@/utils/math';

const useWheel = () => {
  const tempo = useTempo();
  const tempoGrid = useMemo(() => 1 / tempo, [tempo]);

  const handleWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    if (!App.chart) return;

    const { deltaY, shiftKey } = e;
    const seekFactor = deltaY > 0 ? 1 : -1;
    const newTime = GridValue(App.chart.beatNum + ((shiftKey ? 1 : tempoGrid) * seekFactor), tempoGrid);

    App.chart.beatNum = newTime;
  }, [tempoGrid]);

  return {
    onWheel: handleWheel,
  };
};

export default useWheel;
