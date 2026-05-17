import { Fragment, useLayoutEffect, useRef } from 'react';
import { Word } from './Word';
import type { TypedWord } from '../hooks/useTypingEngine';

interface Props {
  words: string[];
  typed: TypedWord[];
  wordIndex: number;
  charIndex: number;
  secondsLeft: number;
}

const LINE_PX = 48;
const CARET_HEIGHT = Math.round(LINE_PX * 0.72);
const CARET_Y_OFFSET = Math.round((LINE_PX - CARET_HEIGHT) / 2);

export function TypingArea({
  words,
  typed,
  wordIndex,
  charIndex,
  secondsLeft,
}: Props) {
  const innerRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLSpanElement>(null);
  const caretRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const inner = innerRef.current;
    const active = activeRef.current;
    const caret = caretRef.current;
    if (!inner || !active || !caret) return;

    // Scroll so the active word's line sits on row 2 of 3.
    const wordTop = active.offsetTop;
    const line = Math.round(wordTop / LINE_PX);
    const offset = Math.max(0, (line - 1) * LINE_PX);
    inner.style.transform = `translateY(-${offset}px)`;

    // Position caret at the current char within the active word.
    // Char spans' offsetLeft/Top are already relative to the inner div
    // (same offsetParent as the word), so do NOT add the word's offsets.
    const charSpans = active.children;
    let x: number;
    let y: number;
    if (charIndex < charSpans.length) {
      const ch = charSpans[charIndex] as HTMLElement;
      x = ch.offsetLeft;
      y = ch.offsetTop;
    } else if (charSpans.length > 0) {
      const lastCh = charSpans[charSpans.length - 1] as HTMLElement;
      x = lastCh.offsetLeft + lastCh.offsetWidth;
      y = lastCh.offsetTop;
    } else {
      x = active.offsetLeft;
      y = active.offsetTop;
    }
    caret.style.transform = `translate(${x}px, ${y + CARET_Y_OFFSET}px)`;
  }, [wordIndex, charIndex, words, typed]);

  return (
    <div className="mx-auto w-full max-w-4xl px-6">
      <div className="mb-3 text-xl text-yellow-400 tabular-nums">
        {Math.ceil(secondsLeft)}
      </div>
      <div
        className="relative overflow-hidden text-3xl"
        style={{ height: 3 * LINE_PX, lineHeight: `${LINE_PX}px` }}
      >
        <div
          ref={innerRef}
          className="relative transition-transform duration-150 ease-out"
        >
          {words.map((w, i) => {
            const isActive = i === wordIndex;
            return (
              <Fragment key={i}>
                <Word
                  ref={isActive ? activeRef : undefined}
                  target={w}
                  typed={typed[i]}
                />{' '}
              </Fragment>
            );
          })}
          <div
            ref={caretRef}
            className="caret pointer-events-none absolute left-0 top-0 w-[2px] bg-yellow-400"
            style={{
              height: `${CARET_HEIGHT}px`,
              transition: 'transform 90ms linear',
              willChange: 'transform',
            }}
          />
        </div>
      </div>
    </div>
  );
}
