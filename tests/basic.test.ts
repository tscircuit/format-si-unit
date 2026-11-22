import { describe, expect, test } from "bun:test"
import {
  formatSiUnit,
  getSiPrefixMultiplier,
  parseAndConvertSiUnit,
  parseSiUnit,
} from "../index"

describe("formatSiUnit", () => {
  test("handles basic cases", () => {
    expect(formatSiUnit(1000)).toBe("1k")
    expect(formatSiUnit(1500)).toBe("1.5k")
    expect(formatSiUnit(1_000_000)).toBe("1M")
  })

  test("handles small numbers", () => {
    expect(formatSiUnit(0.001)).toBe("1m")
    expect(formatSiUnit(0.000001)).toBe("1µ")
    expect(formatSiUnit(0.0001)).toBe("100µ")
    expect(formatSiUnit(0.000000001)).toBe("1n")
  })

  test("handles edge cases", () => {
    expect(formatSiUnit(0)).toBe("0")
    expect(formatSiUnit()).toBe("")
    expect(formatSiUnit(null)).toBe("")
  })

  test("handles numbers needing rounding", () => {
    expect(formatSiUnit(1234)).toBe("1.23k")
    expect(formatSiUnit(9999999)).toBe("10M")
  })
})

describe("parseSiUnit", () => {
  test("handles basic cases", () => {
    expect(parseSiUnit("1k")).toBe(1000)
    expect(parseSiUnit("1K")).toBe(1000)
    expect(parseSiUnit("1.5k")).toBe(1500)
    expect(parseSiUnit("1M")).toBe(1_000_000)
  })

  test("handles small numbers", () => {
    expect(parseSiUnit("1m")).toBe(0.001)
    expect(parseSiUnit("1µ")).toBe(0.000001)
    expect(parseSiUnit("1μ")).toBe(0.000001) // U+03BC Greek mu
    expect(parseSiUnit("1u")).toBe(0.000001)
    expect(parseSiUnit("100µ")).toBeCloseTo(0.0001)
    expect(parseSiUnit("1n")).toBe(0.000000001)
    expect(parseSiUnit("1f")).toBe(0.000000000000001)
  })

  test("handles signed and decimal inputs", () => {
    expect(parseSiUnit("-2.2k")).toBe(-2200)
    expect(parseSiUnit("+.5M")).toBe(500_000)
    expect(parseSiUnit("1e3m")).toBe(1)
  })

  test("handles edge cases", () => {
    expect(parseSiUnit("0")).toBe(0)
    expect(parseSiUnit()).toBeUndefined()
    expect(parseSiUnit(null)).toBeUndefined()
    expect(parseSiUnit("")).toBeUndefined()
    expect(parseSiUnit("   ")).toBeUndefined()
  })

  test("returns NaN for invalid inputs", () => {
    expect(parseSiUnit("abc")).toBeNaN()
    expect(parseSiUnit("1kk")).toBeNaN()
    expect(parseSiUnit("1 k")).toBeNaN()
    expect(parseSiUnit("10mA")).toBeNaN()
  })
})

describe("getSiPrefixMultiplier", () => {
  test("handles common SI prefixes", () => {
    expect(getSiPrefixMultiplier("f")).toBe(1e-15)
    expect(getSiPrefixMultiplier("p")).toBe(1e-12)
    expect(getSiPrefixMultiplier("n")).toBe(1e-9)
    expect(getSiPrefixMultiplier("u")).toBe(1e-6)
    expect(getSiPrefixMultiplier("µ")).toBe(1e-6)
    expect(getSiPrefixMultiplier("m")).toBe(1e-3)
    expect(getSiPrefixMultiplier("k")).toBe(1e3)
    expect(getSiPrefixMultiplier("K")).toBe(1e3)
    expect(getSiPrefixMultiplier("M")).toBe(1e6)
    expect(getSiPrefixMultiplier("G")).toBe(1e9)
    expect(getSiPrefixMultiplier("T")).toBe(1e12)
  })

  test("keeps prefixes case-sensitive", () => {
    expect(getSiPrefixMultiplier("m")).toBe(1e-3)
    expect(getSiPrefixMultiplier("M")).toBe(1e6)
  })

  test("returns undefined for unknown prefixes", () => {
    expect(getSiPrefixMultiplier("")).toBe(1)
    expect(getSiPrefixMultiplier("x")).toBeUndefined()
    expect(getSiPrefixMultiplier("MM")).toBeUndefined()
    expect(getSiPrefixMultiplier("meg")).toBeUndefined()
    expect(getSiPrefixMultiplier("milli")).toBeUndefined()
  })
})

describe("parseAndConvertSiUnit", () => {
  test("passes through nullish and unitless values", () => {
    expect(parseAndConvertSiUnit(undefined)).toEqual({
      parsedUnit: null,
      unitOfValue: null,
      value: null,
    })
    expect(parseAndConvertSiUnit(null)).toEqual({
      parsedUnit: null,
      unitOfValue: null,
      value: null,
    })
    expect(parseAndConvertSiUnit(4.7)).toEqual({
      parsedUnit: null,
      unitOfValue: null,
      value: 4.7,
    })
    expect(parseAndConvertSiUnit("4.7")).toEqual({
      parsedUnit: null,
      unitOfValue: null,
      value: 4.7,
    })
  })

  test("converts known tscircuit units to base units", () => {
    expect(parseAndConvertSiUnit("10kΩ")).toEqual({
      parsedUnit: "kΩ",
      unitOfValue: "Ω",
      value: 10_000,
    })
    expect(parseAndConvertSiUnit("2.2uF")).toEqual({
      parsedUnit: "uF",
      unitOfValue: "F",
      value: 0.0000022,
    })
    expect(parseAndConvertSiUnit("1μF")).toEqual({
      parsedUnit: "μF",
      unitOfValue: "F",
      value: 0.000001,
    })
    expect(parseAndConvertSiUnit("90deg")).toEqual({
      parsedUnit: "deg",
      unitOfValue: "deg",
      value: 90,
    })
    expect(parseAndConvertSiUnit("1rad").value).toBeCloseTo(180 / Math.PI)
  })

  test("converts length, time, and volume variants", () => {
    expect(parseAndConvertSiUnit("2.54cm")).toEqual({
      parsedUnit: "cm",
      unitOfValue: "mm",
      value: 25.4,
    })
    expect(parseAndConvertSiUnit("1in")).toEqual({
      parsedUnit: "in",
      unitOfValue: "mm",
      value: 25.4,
    })
    expect(parseAndConvertSiUnit("5s")).toEqual({
      parsedUnit: "s",
      unitOfValue: "ms",
      value: 5000,
    })
    expect(parseAndConvertSiUnit("1.5L")).toEqual({
      parsedUnit: "L",
      unitOfValue: "ml",
      value: 1500,
    })
  })

  test("uses bare SI prefixes with and without a requested unit", () => {
    expect(parseAndConvertSiUnit("10k")).toEqual({
      parsedUnit: null,
      unitOfValue: null,
      value: 10_000,
    })
    expect(parseAndConvertSiUnit("10k", "Ω")).toEqual({
      parsedUnit: null,
      unitOfValue: "Ω",
      value: 10_000,
    })
  })

  test("converts point objects", () => {
    expect(parseAndConvertSiUnit({ x: "1in", y: "2.54cm" })).toEqual({
      parsedUnit: "in",
      unitOfValue: "mm",
      value: { x: 25.4, y: 25.4 },
    })
  })

  test("parses RKM notation without dropping trailing digits", () => {
    // RKM (IEC 60062) uses the SI prefix letter as a decimal separator.
    // Before the fix these were silently truncated: "4k7" -> 4000 instead of
    // 4700, "2u2" -> 0.000002 instead of 0.0000022, "1R5" -> 1 instead of 1.5.
    // See tscircuit/core#5806.
    expect(parseAndConvertSiUnit("4k7", "Ω")).toEqual({
      parsedUnit: null,
      unitOfValue: "Ω",
      value: 4700,
    })
    expect(parseAndConvertSiUnit("2u2", "F")).toEqual({
      parsedUnit: null,
      unitOfValue: "F",
      value: 0.0000022,
    })
    expect(parseAndConvertSiUnit("1R5", "Ω")).toEqual({
      parsedUnit: null,
      unitOfValue: "Ω",
      value: 1.5,
    })
    expect(parseAndConvertSiUnit("1K5", "Ω").value).toBe(1500)
    expect(parseAndConvertSiUnit("3m3", "H").value).toBeCloseTo(0.0033)
    // "R" alone is a whole-ohm value with no fractional part.
    expect(parseAndConvertSiUnit("1R", "Ω").value).toBe(1)
    // Plain decimal + prefix forms must keep working unchanged.
    expect(parseAndConvertSiUnit("4.7k", "Ω").value).toBe(4700)
    expect(parseAndConvertSiUnit("10k", "Ω").value).toBe(10_000)
  })
})
