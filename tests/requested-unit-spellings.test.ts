import { expect, test } from "bun:test"
import { parseAndConvertSiUnit } from "../index"

test("reads lowercase unit symbols as the requested unit", () => {
  expect(parseAndConvertSiUnit("10nf", "F")).toEqual({
    parsedUnit: "nf",
    unitOfValue: "F",
    value: 1e-8,
  })
  expect(parseAndConvertSiUnit("10mf", "F").value).toBeCloseTo(1e-2)
  expect(parseAndConvertSiUnit("2.2uh", "H").value).toBeCloseTo(2.2e-6)
  expect(parseAndConvertSiUnit("100khz", "Hz").value).toBe(100_000)
  expect(parseAndConvertSiUnit("3.3v", "V").value).toBe(3.3)
  expect(parseAndConvertSiUnit("20ma", "A").value).toBeCloseTo(0.02)
})

test("reads uppercase u, n and p prefixes as micro, nano and pico", () => {
  expect(parseAndConvertSiUnit("10UF", "F").value).toBeCloseTo(1e-5)
  expect(parseAndConvertSiUnit("100NF", "F").value).toBeCloseTo(1e-7)
  expect(parseAndConvertSiUnit("22PF", "F").value).toBeCloseTo(2.2e-11)
})

test("reads plural ohms and the SPICE meg prefix", () => {
  expect(parseAndConvertSiUnit("10 kOhms", "Ω").value).toBe(10_000)
  expect(parseAndConvertSiUnit("100 ohms", "Ω").value).toBe(100)
  expect(parseAndConvertSiUnit("1meg", "Ω").value).toBe(1_000_000)
  expect(parseAndConvertSiUnit("2.2MEG", "Ω").value).toBe(2_200_000)
  expect(parseAndConvertSiUnit("4.7 Megohms", "Ω").value).toBe(4_700_000)
})

test("keeps milli and mega apart", () => {
  expect(parseAndConvertSiUnit("10mohms", "Ω").value).toBeCloseTo(1e-2)
  expect(parseAndConvertSiUnit("10Mohms", "Ω").value).toBe(10_000_000)
})

test("still passes through units that are not the requested one", () => {
  expect(parseAndConvertSiUnit("10xyz", "F")).toEqual({
    parsedUnit: "xyz",
    unitOfValue: "xyz" as never,
    value: 10,
  })
  expect(parseAndConvertSiUnit("10Ω", "F").unitOfValue).toBe("Ω")
  expect(parseAndConvertSiUnit("10nf")).toEqual({
    parsedUnit: "nf",
    unitOfValue: "nf" as never,
    value: 10,
  })
})
