import { forwardRef, memo } from 'react';
import type { TypedWord } from '../hooks/useTypingEngine';

interface Props {
  target: string;
  typed: TypedWord | undefined;
  isActive: boolean;
  charIndex: number;
}

function Caret() {
  return (
    <span className="caret pointer-events-none absolute left-0 top-[0.15em] bottom-[0.15em] w-[2px] bg-yellow-400" />
  );
}

const WordImpl = forwardRef<HTMLSpanElement, Props>(function Word(
  { target, typed, isActive, charIndex },
  ref
) {
  const chars = typed?.chars ?? [];
  const renderedLen = Math.max(target.length, chars.length);
  const showTrailingCaret = isActive && charIndex >= renderedLen;

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
    const showCaret = isActive && charIndex === i;
    spans.push(
      <span key={i} className={`relative ${color}`}>
        {showCaret && <Caret />}
        {glyph}
      </span>
    );
  }

  return (
    <span ref={ref} className="word inline-block">
      {spans}
      {showTrailingCaret && (
        <span className="relative inline-block w-0 align-baseline">
          <Caret />
        </span>
      )}
    </span>
  );
});

export const Word = memo(WordImpl);
