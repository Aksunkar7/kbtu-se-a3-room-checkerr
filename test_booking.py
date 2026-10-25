"""Unit tests for can_book."""

import copy
import unittest

from booking import can_book

NOW = 540
EXISTING = [(600, 660)]
TWO_BOOKINGS = [(600, 660), (800, 900)]


class CanBookTests(unittest.TestCase):

    def test_touching_end_of_existing_booking_is_allowed(self):
        # Intervals are half-open: [660, 720) does not overlap [600, 660).
        self.assertTrue(can_book(660, 720, NOW, False, EXISTING))

    def test_overlapping_existing_booking_is_rejected(self):
        self.assertFalse(can_book(630, 690, NOW, False, EXISTING))

    def test_blocked_flag_overrides_an_otherwise_valid_slot(self):
        self.assertFalse(can_book(660, 720, NOW, True, EXISTING))

    def test_duration_of_exactly_120_minutes_is_allowed(self):
        self.assertTrue(can_book(720, 840, NOW, False, EXISTING))

    def test_duration_of_121_minutes_is_rejected(self):
        self.assertFalse(can_book(720, 841, NOW, False, EXISTING))

    def test_start_equal_to_now_is_rejected(self):
        # AC1 requires start strictly greater than now.
        self.assertFalse(can_book(540, 570, NOW, False, EXISTING))

    def test_reversed_times_are_rejected(self):
        self.assertFalse(can_book(700, 650, NOW, False, EXISTING))

    def test_zero_length_interval_is_rejected(self):
        self.assertFalse(can_book(700, 700, NOW, False, EXISTING))

    def test_end_exactly_at_midnight_is_allowed(self):
        self.assertTrue(can_book(1380, 1440, NOW, False, EXISTING))

    def test_end_past_midnight_is_rejected(self):
        self.assertFalse(can_book(1400, 1441, NOW, False, EXISTING))

    def test_negative_start_is_rejected(self):
        # now is pushed below zero so the lower day bound is the only
        # rule that can reject this slot.
        self.assertFalse(can_book(-10, 50, -20, False, EXISTING))

    def test_overlap_with_the_second_existing_booking_is_rejected(self):
        self.assertFalse(can_book(850, 880, NOW, False, TWO_BOOKINGS))

    def test_slot_fitting_exactly_between_two_bookings_is_allowed(self):
        # [660, 780) touches [600, 660) on the left and [780, 900) on
        # the right, and is exactly 120 minutes long.
        existing = [(600, 660), (780, 900)]
        self.assertTrue(can_book(660, 780, NOW, False, existing))

    def test_existing_is_not_mutated(self):
        # A slot that is ACCEPTED, so the scan runs to completion rather
        # than returning early at the first conflict.
        existing = copy.deepcopy(TWO_BOOKINGS)
        before = copy.deepcopy(existing)
        self.assertTrue(can_book(660, 780, NOW, False, existing))
        self.assertEqual(before, existing)

    def test_non_integer_times_are_rejected(self):
        # AC1 requires whole minutes after midnight. The slot is clear of
        # every existing booking, so the type rule is the only thing that
        # can reject it.
        self.assertFalse(can_book(700.5, 760.5, NOW, False, EXISTING))

    def test_boolean_times_are_rejected(self):
        # bool subclasses int in Python, so True would pass a naive
        # isinstance(value, int) check and be read as minute 1.
        self.assertFalse(can_book(True, 60, 0, False, []))

    def test_non_numeric_times_are_rejected_without_raising(self):
        # Must return False rather than propagate a TypeError, so the UI
        # can render a validation message instead of crashing.
        self.assertFalse(can_book("600", "660", NOW, False, EXISTING))


if __name__ == "__main__":
    unittest.main()
