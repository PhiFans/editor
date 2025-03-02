import { Application, ApplicationRef, extend } from '@pixi/react';
import { Container, Rectangle } from 'pixi.js';
import { useCallback, useEffect, useRef } from 'react';
import Chart from '@/Chart/Chart';
import { CalculateRendererSize } from '@/utils/renderer';
import { Nullable, RendererSize } from '@/utils/types';

const ZeroSizeRectangle = new Rectangle(0, 0, 0, 0);

const PreviewCanvas = () => {
  extend({ Container });

  const containerRef = useRef<Nullable<HTMLDivElement>>(null);
  const appRef = useRef<Nullable<ApplicationRef>>(null);
  const appContainerRef = useRef<Nullable<Container>>(null);
  const sizeRef = useRef<RendererSize>(CalculateRendererSize(1, 1));

  const handleResize = useCallback(() => {
    const containerDom = containerRef.current;
    if (!containerDom) return;
    const { clientWidth, clientHeight } = containerDom;

    if (!appRef.current) return;
    const app = appRef.current.getApplication();
    if (!app) return;

    app.resize();
    const size = CalculateRendererSize(clientWidth, clientHeight);
    sizeRef.current = size;
    Chart.resize(size);
  }, []);

  const handleChartChanged = () => {
    if (!Chart.info) return;
    if (!appContainerRef.current) return;

    const container = appContainerRef.current;
    if (container.children.length !== 0) {
      for (const child of container.children) {
        container.removeChild(child);
      }
    }

    Chart.resize(sizeRef.current);
    container.addChild(Chart.container);
  };

  useEffect(() => {
    if (!containerRef.current) return;

    handleResize();
    const resize = new ResizeObserver(() => {
      handleResize();
    });
    resize.observe(containerRef.current);

    return (() => {
      resize.disconnect();
    })
  }, [handleResize]);

  useEffect(() => {
    Chart.events.on('loaded', handleChartChanged);
    return (() => {
      Chart.events.off('loaded', handleChartChanged);
    });
  }, []);

  return (
    <div
      className="canvas-container"
      ref={containerRef}
    >
      <Application
        resizeTo={containerRef}
        onInit={() => {
          handleResize();
        }}
        ref={appRef}
      >
        <pixiContainer
          label='Preview game container'
          boundsArea={ZeroSizeRectangle}
          zIndex={1}
          ref={appContainerRef}
        />
        <pixiContainer
          label='Preview UI container'
          zIndex={2}
        />
      </Application>
    </div>
  )
};

export default PreviewCanvas;
