import { useEffect } from 'react';
import type { Phase } from './useTypingEngine';

interface Params {
  phase: Phase;
  duration: number;
  startedAt: number | null;
  onTick: (secondsLeft: number) => void;
  onFinish: () => void;
}

export function useCountdown({ phase, duration, startedAt, onTick, onFinish }: Params) {
  useEffect(() => {
    if (phase !== 'running' || startedAt === null) return;
    let finished = false;
    const id = window.setInterval(() => {
      const elapsed = (performance.now() - startedAt) / 1000;
      const left = Math.max(0, duration - elapsed);
      if (left <= 0 && !finished) {
        finished = true;
        onTick(0);
        onFinish();
        window.clearInterval(id);
      } else {
        onTick(left);
      }
    }, 250);
    return () => window.clearInterval(id);
  }, [phase, duration, startedAt, onTick, onFinish]);
}
