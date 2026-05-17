import type { Stats } from '../lib/wpm';

interface Props {
  stats: Stats;
  duration: number;
  onRestart: () => void;
}

export function Results({ stats, duration, onRestart }: Props) {
  return (
    <div className="mx-auto w-full max-w-3xl px-4">
      <div className="grid grid-cols-2 gap-x-12 gap-y-6 sm:grid-cols-4">
        <Stat label="wpm" value={stats.wpm} big />
        <Stat label="raw" value={stats.rawWpm} big />
        <Stat label="acc" value={`${stats.accuracy}%`} big />
        <Stat label="time" value={`${duration}s`} big />
        <Stat label="correct" value={stats.correctChars} />
        <Stat label="wrong" value={stats.incorrectChars} />
      </div>
      <div className="mt-10 flex items-center gap-4">
        <button
          type="button"
          onClick={onRestart}
          className="rounded bg-neutral-800 px-4 py-2 text-neutral-200 hover:bg-neutral-700"
        >
          restart
        </button>
        <span className="text-sm text-neutral-500">or press esc</span>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  big,
}: {
  label: string;
  value: string | number;
  big?: boolean;
}) {
  return (
    <div>
      <div className="text-sm text-neutral-500">{label}</div>
      <div
        className={
          'tabular-nums text-yellow-400 ' + (big ? 'text-5xl' : 'text-2xl')
        }
      >
        {value}
      </div>
    </div>
  );
}
