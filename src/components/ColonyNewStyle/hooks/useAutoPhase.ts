import { useEffect, useState } from 'react';
import { Phase } from '../types/ModeToggleType';

export function useAutoPhase(lightMode: string, intervalMs = 5000): Phase {
  const [phase, setPhase] = useState<Phase>('morning');

  useEffect(() => {
    if (lightMode !== 'auto') return;

    const phases: Phase[] = ['morning', 'midday', 'night'];
    let currentIndex = 0;

    // Initialize phase
    setPhase(phases[currentIndex]);

    const timerId = window.setInterval(() => {
      currentIndex = (currentIndex + 1) % phases.length;
      setPhase(phases[currentIndex]);
    }, intervalMs);

    return () => window.clearInterval(timerId);
  }, [lightMode, intervalMs]);

  return phase;
}
