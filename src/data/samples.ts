// Hardcoded fictional data for the room availability checker.
// All times are integer minutes after midnight (0 = 00:00, 1440 = 24:00).

export interface Booking {
  start: number; // minutes after midnight
  end: number; // minutes after midnight
  bookedBy: string;
}

export const ROOM = {
  name: 'Room 301',
  blocked: false,
  blockReason: undefined as string | undefined,
};

// Existing bookings for Room 301: (600, 660) = 10:00–11:00.
export const BOOKINGS: Booking[] = [
  { start: 600, end: 660, bookedBy: 'Faculty meeting' },
];

// The fixed "current time" used by the checker (540 = 09:00).
export const NOW = 540;

export const DAY_END = 1440;
export const MAX_DURATION = 120;
