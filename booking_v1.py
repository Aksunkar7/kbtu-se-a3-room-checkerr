"""Booking validation for a single room, half-open interval model."""

MAX_DURATION = 120
DAY_END = 1440


def can_book(start: int, end: int, now: int, blocked: bool,
             existing: list[tuple[int, int]]) -> bool:
    if blocked:
        return False
    if not 0 <= start < end <= DAY_END:
        return False
    if start <= now:
        return False
    if end - start > MAX_DURATION:
        return False
    for busy_start, busy_end in existing:
        if start < busy_end and busy_start < end:
            return False
    return True
