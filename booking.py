"""Booking validation for a single room, half-open interval model."""

MAX_DURATION = 120
DAY_END = 1440


def _is_minute(value) -> bool:
    """True only for a plain int. bool subclasses int, so without the
    second test True and False would pass as the minutes 1 and 0."""
    return isinstance(value, int) and not isinstance(value, bool)


def can_book(start: int, end: int, now: int, blocked: bool,
             existing: list[tuple[int, int]]) -> bool:
    """Return True if [start, end) is a legal booking, else False.

    Times are integer minutes after midnight. Intervals are half-open,
    so touching at an endpoint is not a conflict. `existing` is only read.
    """
    # AC3: unconditional veto, cheapest check first.
    if blocked:
        return False

    # AC1: integer minutes only. Ahead of every comparison, so a float,
    # a bool or a non-numeric type returns False instead of raising.
    if not (_is_minute(start) and _is_minute(end) and _is_minute(now)):
        return False

    # AC1: well-formed interval inside the day, strictly in the future.
    if not 0 <= start < end <= DAY_END:
        return False
    if start <= now:
        return False

    # AC2: duration cap; 120 passes, 121 does not.
    if end - start > MAX_DURATION:
        return False

    # AC4: O(n) scan last. Half-open overlap test; AC5 holds because
    # this only reads — nothing is sorted, appended to, or reassigned.
    for busy_start, busy_end in existing:
        if start < busy_end and busy_start < end:
            return False

    return True
