import { useState } from 'react';
import { Building2, Search } from 'lucide-react';
import { RoomInfo } from '@/components/RoomInfo';
import { ResultBanner } from '@/components/ResultBanner';
import {
  checkAvailability,
  minutesToLabel,
  type CheckResult,
} from '@/lib/availability';
import { DAY_END, MAX_DURATION, NOW } from '@/data/samples';

function App() {
  const [startStr, setStartStr] = useState('');
  const [endStr, setEndStr] = useState('');
  const [result, setResult] = useState<CheckResult | null>(null);

  const startNum = startStr === '' ? null : Number(startStr);
  const endNum = endStr === '' ? null : Number(endStr);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (startNum === null || endNum === null || Number.isNaN(startNum) || Number.isNaN(endNum)) {
      setResult({
        available: false,
        rule: 'AC1',
        reason:
          'AC1: please enter integer start and end times in minutes after midnight (0–1440).',
      });
      return;
    }
    setResult(checkAvailability({ start: startNum, end: endNum }));
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-8">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-600 text-white">
              <Building2 className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <h1 className="text-lg font-bold tracking-tight sm:text-xl">
                Smart Campus Room Availability Checker
              </h1>
              <p className="text-xs text-slate-500 sm:text-sm">
                Check whether Room 301 is free for your requested time slot.
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="space-y-6">
          {/* Room + existing bookings */}
          <RoomInfo />

          {/* Request form */}
          <form
            onSubmit={handleSubmit}
            className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5"
            noValidate
          >
            <h2 className="mb-1 text-sm font-medium text-slate-700">
              Requested interval
            </h2>
            <p className="mb-4 text-xs text-slate-400">
              Times are integer minutes after midnight (0 = 00:00, 1440 = 24:00).
              Now is {NOW} ({minutesToLabel(NOW)}); start must be strictly after now.
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              <TimeField
                id="startTime"
                label="Start (min)"
                value={startStr}
                onChange={setStartStr}
                preview={startNum}
                helper={`0–${DAY_END}`}
              />
              <TimeField
                id="endTime"
                label="End (min)"
                value={endStr}
                onChange={setEndStr}
                preview={endNum}
                helper={`Max ${MAX_DURATION} min after start`}
              />
            </div>

            <button
              type="submit"
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-1 sm:w-auto"
            >
              <Search className="h-4 w-4" aria-hidden />
              Check availability
            </button>
          </form>

          {/* Verdict */}
          <ResultBanner result={result} />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-2xl px-4 py-4 text-center text-xs text-slate-400 sm:px-6">
          Demo data only — no real bookings are created or modified.
        </div>
      </footer>
    </div>
  );
}

interface TimeFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  preview: number | null;
  helper: string;
}

function TimeField({ id, label, value, onChange, preview, helper }: TimeFieldProps) {
  const validPreview =
    preview !== null && Number.isInteger(preview) && preview >= 0 && preview <= DAY_END;
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1 block text-sm font-medium text-slate-700"
      >
        {label}
      </label>
      <input
        id={id}
        type="number"
        inputMode="numeric"
        min={0}
        max={DAY_END}
        step={1}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g. 660"
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
      />
      <p className="mt-1 text-xs text-slate-400">
        {helper}
        {validPreview && (
          <span className="ml-1 text-slate-500">
            · {minutesToLabel(preview as number)}
          </span>
        )}
      </p>
    </div>
  );
}

export default App;
