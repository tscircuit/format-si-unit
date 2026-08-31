import { expect, test } from "bun:test"
import { formatSiUnit } from "../index"

// Covers the exponential-notation bug near SI band boundaries (#9).
//
// Before the fix, the prefix was picked before the existing 3-sig-fig
// rounding ran, so a value just under a band's top (>= 999.5 * prefix)
// rounded up to 1000 -- which JS prints as "1.00e+3" -- with no rollover
// to the next prefix:
//
//   formatSiUnit(999.5)  -> "1.00e+3"   (now "1k")
//   formatSiUnit(999999) -> "1.00e+3k"  (now "1M")
//
// The rounding itself is intended (see "handles numbers needing rounding",
// e.g. 1234 -> "1.23k"); the bug was the missing rollover, not the rounding.
test("formatSiUnit rolls over instead of emitting exponential notation", () => {
  expect(formatSiUnit(999.5)).toBe("1k")
  expect(formatSiUnit(999999)).toBe("1M")
  expect(formatSiUnit(-999.6)).toBe("-1k")
  // No formatted value should ever contain exponential notation.
  for (const v of [999.5, 999999, -999.6, 9.995e8]) {
    expect(formatSiUnit(v)).not.toContain("e")
  }
})

test("formatSiUnit does not emit exponential notation at the Tera band", () => {
  // At the top prefix there is no larger band to roll into, so rounding to
  // 1000 previously left toPrecision(3) emitting "1.00e+3T" instead of "1000T".
  expect(formatSiUnit(1e15)).toBe("1000T")
  expect(formatSiUnit(9.995e14)).toBe("1000T")
  for (const v of [1e15, 9.995e14, -1e15]) {
    const out = formatSiUnit(v)
    expect(out).not.toContain("e")
    expect(out).not.toContain("E")
  }
})
