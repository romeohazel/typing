import { useEffect, useMemo } from 'react';
import { useTypingEngine } from './hooks/useTypingEngine';
import { useCountdown } from './hooks/useCountdown';
import { TypingArea } from './components/TypingArea';
import { DurationPicker } from './components/DurationPicker';
import { Results } from './components/Results';
import { computeStats } from './lib/wpm';

const PREVENTED_KEYS = new Set(['Tab', ' ', 'Backspace', 'Escape']);

export default function App() {
  const { state, onKey, onTick, onFinish, onRestart, setDuration } = useTypingEngine(30);

  useCountdown({
    phase: state.phase,
    duration: state.duration,
    startedAt: state.startedAt,
    onTick,
    onFinish,
  });

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        onRestart();
        return;
      }
      if (state.phase === 'done') return;
      const isPrintable = e.key.length === 1 && e.key !== ' ';
      if (PREVENTED_KEYS.has(e.key) || isPrintable) {
        e.preventDefault();
      }
      if (isPrintable || e.key === ' ' || e.key === 'Backspace') {
        onKey(e.key);
      }
    }
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onKey, onRestart, state.phase]);

  const stats = useMemo(
    () => (state.phase === 'done' ? computeStats(state.typed, state.duration) : null),
    [state.phase, state.typed, state.duration]
  );

  return (
    <div className="flex min-h-screen flex-col">
      <header className="mx-auto w-full max-w-4xl px-6 pt-5">
        <h1 className="text-lg text-neutral-300">
          type<span className="text-yellow-400">.</span>
        </h1>
      </header>

      <main className="flex flex-1 flex-col justify-center gap-5 pb-16">
        <DurationPicker
          duration={state.duration}
          disabled={state.phase === 'running'}
          onChange={setDuration}
        />
        {state.phase === 'done' && stats ? (
          <Results stats={stats} duration={state.duration} onRestart={onRestart} />
        ) : (
          <TypingArea
            words={state.words}
            typed={state.typed}
            wordIndex={state.wordIndex}
            charIndex={state.charIndex}
            secondsLeft={state.secondsLeft}
          />
        )}
      </main>

      <footer className="mx-auto w-full max-w-4xl px-6 pb-4 text-xs text-neutral-600">
        esc — restart
      </footer>
    </div>
  );
}
