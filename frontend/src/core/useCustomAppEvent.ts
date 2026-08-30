import { useApp } from '@playcanvas/react/hooks';
import { useEffect } from 'react';

export function useCustomAppEvent<T extends (...args: any[]) => void>(
  event: string,
  callback: T
) {
  const app = useApp();

  useEffect(() => {
    app.on(event, callback);
    return () => {
      app.off(event, callback);
    };
  }, [app, event, callback]);
}
