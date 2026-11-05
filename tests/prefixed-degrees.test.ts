import { expect, test } from "bun:test"
import { parseAndConvertSiUnit } from "../index"

test("converts prefixed degree values to degrees", () => {
  for (const [input, expected] of [
    ["250mdeg", 0.25],
    ["-250mdeg", -0.25],
    ["1000udeg", 0.001],
    ["1000µdeg", 0.001],
    ["1000μdeg", 0.001],
    ["1kdeg", 1000],
  ] as const) {
    const result = parseAndConvertSiUnit(input)
    expect(result.parsedUnit).toBe(input.replace(/^-?\d+/, ""))
    expect(result.unitOfValue).toBe("deg")
    expect(result.value).toBeCloseTo(expected, 10)
  }
})

test("converts prefixed degrees with an explicit base unit", () => {
  expect(parseAndConvertSiUnit("250mdeg", "deg")).toEqual({
    parsedUnit: "mdeg",
    unitOfValue: "deg",
    value: 0.25,
  })
})

test("converts prefixed degree coordinates", () => {
  expect(parseAndConvertSiUnit({ x: "250mdeg", y: "500mdeg" })).toEqual({
    parsedUnit: "mdeg",
    unitOfValue: "deg",
    value: { x: 0.25, y: 0.5 },
  })
})

test("preserves plain degrees, radians and unknown-unit fallback", () => {
  expect(parseAndConvertSiUnit("90deg")).toEqual({
    parsedUnit: "deg",
    unitOfValue: "deg",
    value: 90,
  })
  expect(parseAndConvertSiUnit(`${Math.PI}rad`).value).toBeCloseTo(180, 10)
  expect(parseAndConvertSiUnit("1mrad").value).toBeCloseTo(
    0.001 * (180 / Math.PI),
    10,
  )
  const unknown = parseAndConvertSiUnit("1megdeg")
  expect(unknown.parsedUnit).toBe("megdeg")
  expect(String(unknown.unitOfValue)).toBe("megdeg")
  expect(unknown.value).toBe(1)
})
