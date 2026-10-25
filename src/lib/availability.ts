import { ROOM, BOOKINGS, NOW, DAY_END, MAX_DURATION } from '@/data/samples';

export interface CheckRequest {
  start: number;
  end: number;
}

export type Rule = 'AC1' | 'AC2' | 'AC3' | 'AC4' | 'OK';

export interface CheckResult {
  available: boolean;
  rule: Rule;
  reason: string;
}

/**
 * Overlap of two half-open intervals [aStart, aEnd) and [bStart, bEnd).
 * Comparisons are STRICT, so touching endpoints are NOT an overlap (AC4).
 */
export function intervalsOverlap(
  aStart: number,
  aEnd: number,
  bStart: number,
  bEnd: number,
): boolean {
  return aStart < bEnd && bStart < aEnd;
}

/** Convert minutes-from-midnight to HH:MM for display. */
export function minutesToLabel(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/**
 * Pure function: applies AC1 → AC2 → AC3 → AC4 in order and returns exactly
 * one verdict. The BOOKINGS array is never mutated (AC5).
 */
export function checkAvailability({ start, end }: CheckRequest): CheckResult {
  // AC3 — a blocked room is always unavailable (unconditional O(1) veto,
  // checked first so nothing downstream can mask the real reason).
  if (ROOM.blocked) {
    return {
      available: false,
      rule: 'AC3',
      reason: `AC3: ${ROOM.name} is blocked${ROOM.blockReason ? ` — ${ROOM.blockReason}` : ''}.`,
    };
  }

  // AC1 — valid integer interval, and start strictly after now.
  if (!Number.isInteger(start) || !Number.isInteger(end)) {
    return {
      available: false,
      rule: 'AC1',
      reason: `AC1: start and end must be integer minutes. Received start=${start}, end=${end}.`,
    };
  }
  if (start < 0 || end > DAY_END || start >= end) {
    return {
      available: false,
      rule: 'AC1',
      reason: `AC1: require 0 ≤ start < end ≤ ${DAY_END}. Received start=${start}, end=${end}.`,
    };
  }
  if (start <= NOW) {
    return {
      available: false,
      rule: 'AC1',
      reason: `AC1: start must be strictly greater than now (${NOW} / ${minutesToLabel(NOW)}). Received start=${start}.`,
    };
  }

  // AC2 — maximum duration of 120 minutes (exactly 120 is allowed).
  const duration = end - start;
  if (duration > MAX_DURATION) {
    return {
      available: false,
      rule: 'AC2',
      reason: `AC2: duration must be ≤ ${MAX_DURATION} min. Requested ${duration} min (end ${end} − start ${start}).`,
    };
  }

  // AC4 — reject overlap with any existing booking (touching allowed).
  for (const b of BOOKINGS) {
    if (intervalsOverlap(start, end, b.start, b.end)) {
      return {
        available: false,
        rule: 'AC4',
        reason: `AC4: overlaps existing booking ${minutesToLabel(b.start)}–${minutesToLabel(b.end)} (${b.start}–${b.end} min) by ${b.bookedBy}.`,
      };
    }
  }

  return {
    available: true,
    rule: 'OK',
    reason: `${ROOM.name} is available for ${duration} min (${minutesToLabel(start)}–${minutesToLabel(end)}).`,
  };
}
