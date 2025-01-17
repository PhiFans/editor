import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Application, ApplicationOptions } from 'pixi.js';
import { Nullable } from '@/utils/types';

type PixiHookOptions = Partial<ApplicationOptions> & {
  containerRef?: React.RefObject<HTMLDivElement>,
};

type PixiHookResult = [
  Nullable<Application>,
  () => void,
];

const usePixi = ({
  containerRef,
  ...options
}: PixiHookOptions): PixiHookResult => {
  const [ app, setApp ] = useState<Nullable<Application>>(null);
  const appRef = useRef<Nullable<Application>>(null);
  const isCanvasPushed = useRef<boolean>(false);

  const destroy = useCallback(() => {
    if (!appRef.current) return;

    appRef.current.destroy({ removeView: true }, {});
    appRef.current = null;
    isCanvasPushed.current = false;
    setApp(null);
  }, []);

  useEffect(() => {
    if (appRef.current !== null) return;

    const _options: Partial<ApplicationOptions> = { hello: true, ...options };
    if (containerRef && containerRef.current) {
      const containerDom = containerRef.current;
      _options.width = containerDom.clientWidth;
      _options.height = containerDom.clientHeight;
      _options.resizeTo = containerDom;
    }

    const newApp = new Application();
    newApp.init(_options)
      .then(() => {
        appRef.current = newApp;
        setApp(newApp);

        if (containerRef && containerRef.current) {
          if (!isCanvasPushed.current) {
            containerRef.current.appendChild(newApp.canvas);
            isCanvasPushed.current = true;
          }
        }
      })
      .catch((e) => { throw e });
  }, [containerRef, options]);

  return [
    app,
    destroy,
  ];
};

export default usePixi;
