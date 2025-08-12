import { useEffect, useState } from 'react';

export function useCoverOffsets(
  imgW: number,
  imgH: number,
  containerRef?: React.RefObject<HTMLElement> // 👈 optional
) {
  const [state, setState] = useState({ scale: 1, offX: 0, offY: 0 });

  useEffect(() => {
    const recalc = () => {
      let vw: number, vh: number;

      if (containerRef?.current) {
        const rect = containerRef.current.getBoundingClientRect();
        vw = rect.width;
        vh = rect.height;
      } else {
        vw = window.innerWidth;
        vh = window.innerHeight;
      }

      const scale = Math.min(vw / imgW, vh / imgH);
      setState({
        scale,
        offX: (vw - imgW * scale) / 2,
        offY: (vh - imgH * scale) / 2,
      });
    };

    recalc();
    window.addEventListener('resize', recalc);
    window.addEventListener('fullscreenchange', recalc);
    return () => {
      window.removeEventListener('resize', recalc);
      window.removeEventListener('fullscreenchange', recalc);
    };
  }, [imgW, imgH, containerRef]);

  return state;
}
