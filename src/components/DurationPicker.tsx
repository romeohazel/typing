import type { Duration } from '../hooks/useTypingEngine';

const DURATIONS: Duration[] = [15, 30, 60, 120];

interface Props {
  duration: Duration;
  disabled: boolean;
  onChange: (d: Duration) => void;
}

export function DurationPicker({ duration, disabled, onChange }: Props) {
  return (
    <div className="mx-auto flex w-full max-w-3xl items-center gap-4 px-4 text-sm">
      <span className="text-neutral-500">time</span>
      {DURATIONS.map((d) => {
        const selected = d === duration;
        return (
          <button
            key={d}
            type="button"
            disabled={disabled}
            onClick={() => onChange(d)}
            className={
              'tabular-nums transition-colors ' +
              (disabled
                ? 'text-neutral-700'
                : selected
                  ? 'text-yellow-400'
                  : 'text-neutral-500 hover:text-neutral-200')
            }
          >
            {d}
          </button>
        );
      })}
    </div>
  );
}
