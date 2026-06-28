import { expect, test } from "bun:test"
import { formatSiUnit } from "../index"

// Reproduces the exponential-notation bug near SI band boundaries (#9).
//
// This test FAILS on main: the SI prefix is chosen from the raw value
// before the existing 3-sig-fig rounding runs, so a value just under a
// band's top (>= 999.5 * prefix) gets rounded up to 1000 by
// `toPrecision(3)` -- which JS serializes as "1.00e+3" -- and nothing
// rolls over to the next-larger prefix.
//
//   formatSiUnit(999.5)  -> "1.00e+3"   (expected "1k")
//   formatSiUnit(999999) -> "1.00e+3k"  (expected "1M")
//
// The rounding itself is intended/pre-existing behavior (see the
// "handles numbers needing rounding" test, e.g. 1234 -> "1.23k"); the
// bug is the missing prefix rollover, not the rounding. Fix: #10.
test("formatSiUnit rolls over instead of emitting exponential notation", () => {
  expect(formatSiUnit(999.5)).toBe("1k")
  expect(formatSiUnit(999999)).toBe("1M")
  expect(formatSiUnit(-999.6)).toBe("-1k")
  // No formatted value should ever contain exponential notation.
  for (const v of [999.5, 999999, -999.6, 9.995e8]) {
    expect(formatSiUnit(v)).not.toContain("e")
  }
})
