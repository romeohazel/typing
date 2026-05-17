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

const LINE_PX = 40; // matches leading-10 / 2.5rem at 16px base

export function TypingArea({ words, typed, wordIndex, charIndex, secondsLeft }: Props) {
  const innerRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const active = activeRef.current;
    const inner = innerRef.current;
    if (!active || !inner) return;
    const top = active.offsetTop;
    const line = Math.round(top / LINE_PX);
    const offset = Math.max(0, (line - 1) * LINE_PX);
    inner.style.transform = `translateY(-${offset}px)`;
  }, [wordIndex, words.length]);

  return (
    <div className="mx-auto w-full max-w-3xl px-4">
      <div className="mb-3 text-2xl text-yellow-400 tabular-nums">
        {Math.ceil(secondsLeft)}
      </div>
      <div
        className="relative overflow-hidden text-2xl leading-10"
        style={{ height: 3 * LINE_PX }}
      >
        <div ref={innerRef} className="transition-transform duration-150 ease-out">
          {words.map((w, i) => {
            const isActive = i === wordIndex;
            return (
              <Fragment key={i}>
                <Word
                  ref={isActive ? activeRef : undefined}
                  target={w}
                  typed={typed[i]}
                  isActive={isActive}
                  charIndex={isActive ? charIndex : 0}
                />{' '}
              </Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
