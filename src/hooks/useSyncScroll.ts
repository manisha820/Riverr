import { useRef, useCallback } from 'react';

export const useSyncScroll = () => {
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  const onScroll = useCallback((source: 'left' | 'right') => {
    const src = source === 'left' ? leftRef.current : rightRef.current;
    const dst = source === 'left' ? rightRef.current : leftRef.current;

    if (src && dst) {
      dst.scrollTop = src.scrollTop;
    }
  }, []);

  return { leftRef, rightRef, onScroll };
};
