import { forwardRef, memo } from 'react';
import type { TypedWord } from '../hooks/useTypingEngine';

interface Props {
  target: string;
  typed: TypedWord | undefined;
}

const WordImpl = forwardRef<HTMLSpanElement, Props>(function Word(
  { target, typed },
  ref
) {
  const chars = typed?.chars ?? [];
  const renderedLen = Math.max(target.length, chars.length);

  const spans = [];
  for (let i = 0; i < renderedLen; i++) {
    const tc = chars[i];
    let color = 'text-neutral-600';
    let glyph = target[i] ?? tc?.char ?? '';
    if (tc) {
      if (i < target.length) {
        color = tc.correct ? 'text-neutral-100' : 'text-red-500';
        glyph = target[i];
      } else {
        color = 'text-red-700';
        glyph = tc.char;
      }
    }
    spans.push(
      <span key={i} className={color}>
        {glyph}
      </span>
    );
  }

  return (
    <span ref={ref} className="word inline-block">
      {spans}
    </span>
  );
});

export const Word = memo(WordImpl);
