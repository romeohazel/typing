import { useReducer, useCallback } from 'react';
import { generateWords } from '../lib/generate';

export type Phase = 'idle' | 'running' | 'done';
export type Duration = 15 | 30 | 60 | 120;

export interface TypedChar {
  char: string;
  correct: boolean;
}

export interface TypedWord {
  chars: TypedChar[];
  completed: boolean;
}

export interface EngineState {
  phase: Phase;
  duration: Duration;
  secondsLeft: number;
  words: string[];
  typed: TypedWord[];
  wordIndex: number;
  charIndex: number;
  startedAt: number | null;
}

type Action =
  | { type: 'KEY'; key: string }
  | { type: 'TICK'; secondsLeft: number }
  | { type: 'FINISH' }
  | { type: 'RESTART' }
  | { type: 'SET_DURATION'; duration: Duration };

const INITIAL_BUFFER = 120;
const REFILL_THRESHOLD = 0.7;
const REFILL_AMOUNT = 100;
const OVERFLOW_CAP = 8;

const init = (duration: Duration): EngineState => ({
  phase: 'idle',
  duration,
  secondsLeft: duration,
  words: generateWords(INITIAL_BUFFER),
  typed: [{ chars: [], completed: false }],
  wordIndex: 0,
  charIndex: 0,
  startedAt: null,
});

function isPrintable(key: string): boolean {
  return key.length === 1 && key !== ' ';
}

function reducer(state: EngineState, action: Action): EngineState {
  switch (action.type) {
    case 'SET_DURATION': {
      if (state.phase === 'running') return state;
      return init(action.duration);
    }
    case 'RESTART':
      return init(state.duration);
    case 'TICK':
      return { ...state, secondsLeft: action.secondsLeft };
    case 'FINISH':
      return { ...state, phase: 'done', secondsLeft: 0 };
    case 'KEY': {
      if (state.phase === 'done') return state;
      const key = action.key;
      const isPrint = isPrintable(key);
      const isSpace = key === ' ';
      const isBackspace = key === 'Backspace';
      if (!isPrint && !isSpace && !isBackspace) return state;

      let phase = state.phase;
      let startedAt = state.startedAt;
      if (phase === 'idle') {
        if (isBackspace) return state;
        phase = 'running';
        startedAt = performance.now();
      }

      let { wordIndex, charIndex, words } = state;
      const typed = state.typed.slice();
      if (!typed[wordIndex]) typed[wordIndex] = { chars: [], completed: false };
      const active: TypedWord = {
        chars: typed[wordIndex].chars.slice(),
        completed: typed[wordIndex].completed,
      };
      typed[wordIndex] = active;
      const target = words[wordIndex] ?? '';

      if (isSpace) {
        if (active.chars.length === 0) return state;
        active.completed = true;
        wordIndex += 1;
        charIndex = 0;
        const nextSlot = typed[wordIndex];
        typed[wordIndex] = nextSlot
          ? { chars: nextSlot.chars.slice(), completed: false }
          : { chars: [], completed: false };
        if (wordIndex / words.length > REFILL_THRESHOLD) {
          words = words.concat(generateWords(REFILL_AMOUNT));
        }
      } else if (isBackspace) {
        if (active.chars.length > 0) {
          active.chars.pop();
          charIndex = active.chars.length;
        } else if (wordIndex > 0) {
          wordIndex -= 1;
          const prev: TypedWord = {
            chars: typed[wordIndex].chars.slice(),
            completed: false,
          };
          typed[wordIndex] = prev;
          charIndex = prev.chars.length;
        }
      } else if (isPrint) {
        if (active.chars.length >= target.length + OVERFLOW_CAP) return state;
        const expected = target[active.chars.length];
        const correct = expected !== undefined && key === expected;
        active.chars.push({ char: key, correct });
        charIndex = active.chars.length;
      }

      return { ...state, phase, startedAt, typed, wordIndex, charIndex, words };
    }
    default:
      return state;
  }
}

export function useTypingEngine(initialDuration: Duration = 30) {
  const [state, dispatch] = useReducer(reducer, initialDuration, init);

  const onKey = useCallback((key: string) => dispatch({ type: 'KEY', key }), []);
  const onTick = useCallback(
    (secondsLeft: number) => dispatch({ type: 'TICK', secondsLeft }),
    []
  );
  const onFinish = useCallback(() => dispatch({ type: 'FINISH' }), []);
  const onRestart = useCallback(() => dispatch({ type: 'RESTART' }), []);
  const setDuration = useCallback(
    (duration: Duration) => dispatch({ type: 'SET_DURATION', duration }),
    []
  );

  return { state, onKey, onTick, onFinish, onRestart, setDuration };
}
