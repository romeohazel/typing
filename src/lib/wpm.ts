import type { TypedWord } from '../hooks/useTypingEngine';

export interface Stats {
  wpm: number;
  rawWpm: number;
  accuracy: number;
  correctChars: number;
  incorrectChars: number;
}

export function computeStats(typed: TypedWord[], durationSec: number): Stats {
  let correct = 0;
  let incorrect = 0;
  for (const word of typed) {
    for (const c of word.chars) {
      if (c.correct) correct++;
      else incorrect++;
    }
  }
  const totalTyped = correct + incorrect;
  const elapsedMin = durationSec / 60;
  const wpm = elapsedMin > 0 ? Math.round((correct / 5) / elapsedMin) : 0;
  const rawWpm = elapsedMin > 0 ? Math.round((totalTyped / 5) / elapsedMin) : 0;
  const accuracy =
    totalTyped === 0 ? 0 : Math.round((correct / totalTyped) * 1000) / 10;
  return { wpm, rawWpm, accuracy, correctChars: correct, incorrectChars: incorrect };
}
