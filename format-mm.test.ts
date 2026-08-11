import { expect, test } from "bun:test"
import { formatMm } from "./format-mm"

test("formatMm keeps a fixed millimetre unit and removes floating-point dust", () => {
  expect(formatMm(46.00000000000001)).toBe("46mm")
  expect(formatMm(1.23456)).toBe("1.235mm")
  expect(formatMm(0.001)).toBe("0.001mm")
  expect(formatMm(-2.5)).toBe("-2.5mm")
})
