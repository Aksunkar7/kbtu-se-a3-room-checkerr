import { CheckCircle2, XCircle } from 'lucide-react';
import type { CheckResult } from '@/lib/availability';

interface ResultBannerProps {
  result: CheckResult | null;
}

export function ResultBanner({ result }: ResultBannerProps) {
  if (!result) return null;

  const ok = result.available;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`mt-6 flex items-start gap-3 rounded-xl border p-4 transition-all sm:p-5 ${
        ok
          ? 'border-emerald-200 bg-emerald-50'
          : 'border-rose-200 bg-rose-50'
      }`}
    >
      {ok ? (
        <CheckCircle2
          className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600"
          aria-hidden
        />
      ) : (
        <XCircle
          className="mt-0.5 h-5 w-5 shrink-0 text-rose-600"
          aria-hidden
        />
      )}
      <div className="min-w-0">
        <p
          className={`text-sm font-semibold sm:text-base ${
            ok ? 'text-emerald-900' : 'text-rose-900'
          }`}
        >
          {ok ? 'Available' : 'Unavailable'}
          {!ok && (
            <span className="ml-2 rounded bg-rose-100 px-1.5 py-0.5 text-xs font-semibold text-rose-700">
              {result.rule}
            </span>
          )}
        </p>
        <p
          className={`mt-0.5 text-xs sm:text-sm ${
            ok ? 'text-emerald-800' : 'text-rose-800'
          }`}
        >
          {result.reason}
        </p>
      </div>
    </div>
  );
}
