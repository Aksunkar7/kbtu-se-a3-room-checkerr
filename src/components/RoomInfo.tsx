import { Clock, DoorClosed, CalendarDays } from 'lucide-react';
import { ROOM, BOOKINGS, NOW } from '@/data/samples';
import { minutesToLabel } from '@/lib/availability';

export function RoomInfo() {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <DoorClosed className="h-5 w-5 text-sky-600" aria-hidden />
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">
              Room
            </p>
            <p className="text-base font-semibold text-slate-800 sm:text-lg">
              {ROOM.name}
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 sm:text-sm">
          <Clock className="h-3.5 w-3.5" aria-hidden />
          Now: {NOW} min ({minutesToLabel(NOW)})
        </span>
      </div>

      <div className="mt-4 border-t border-slate-100 pt-4">
        <p className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-400">
          <CalendarDays className="h-3.5 w-3.5" aria-hidden />
          Existing bookings
        </p>
        <ul className="space-y-2">
          {BOOKINGS.map((b, i) => (
            <li
              key={i}
              className="flex flex-wrap items-center justify-between gap-x-2 gap-y-0.5 rounded-lg bg-slate-50 px-3 py-2 text-xs sm:text-sm"
            >
              <span className="font-medium text-slate-700">
                {minutesToLabel(b.start)}–{minutesToLabel(b.end)}{' '}
                <span className="text-slate-400">
                  ({b.start}–{b.end} min)
                </span>
              </span>
              <span className="text-slate-500">{b.bookedBy}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
