import { useState, useEffect } from 'react';

/**
 * Hook que detecta si el viewport es mobile según el ancho especificado.
 * @param maxWidth - Ancho máximo en px para considerar mobile (default: 767)
 * @returns `true` si el viewport es igual o menor al maxWidth
 */
const useIsMobile = (maxWidth: number = 767): boolean => {
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth <= maxWidth);

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${maxWidth}px)`);

    const handleChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };

    setIsMobile(mediaQuery.matches); // actualiza al montar
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [maxWidth]);

  return isMobile;
};

export default useIsMobile;
