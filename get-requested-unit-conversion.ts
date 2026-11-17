import { getSiPrefixMultiplier } from "./get-si-prefix-multiplier"
import type { BaseTscircuitUnit } from "./parse-and-convert-si-unit"

/**
 * Lowercase spellings of each electrical unit, longest first, as people
 * commonly write them ("10nf", "2.2uh", "100khz", "10 kOhms").
 */
const LOWERCASE_UNIT_SPELLINGS: Partial<Record<BaseTscircuitUnit, string[]>> = {
  Ω: ["ohms", "ohm", ""],
  F: ["f", ""],
  H: ["h", ""],
  Hz: ["hz", ""],
  V: ["v", ""],
  A: ["a", ""],
}

/**
 * Prefixes whose uppercase and lowercase forms mean the same thing, plus the
 * SPICE "meg". "m" and "M" are left out because milli and mega differ.
 */
const CASE_INSENSITIVE_PREFIX_MULTIPLIERS: Record<string, number> = {
  meg: 1e6,
  u: 1e-6,
  n: 1e-9,
  p: 1e-12,
}

function getRequestedPrefixMultiplier(prefix: string): number | undefined {
  return (
    getSiPrefixMultiplier(prefix) ??
    CASE_INSENSITIVE_PREFIX_MULTIPLIERS[prefix.toLowerCase()]
  )
}

/**
 * Read a unit the exact lookup did not recognise as the unit the caller asked
 * for, ignoring the case of the unit symbol, so "10nf" requested as "F" is
 * 10 nF instead of 10 with an unknown unit.
 *
 * Returns undefined when the unit is not a spelling of the requested unit,
 * which keeps the existing passthrough for unknown units.
 */
export function getRequestedUnitConversionFactor(params: {
  unit: string
  requestedUnit: BaseTscircuitUnit
}): number | undefined {
  const { unit, requestedUnit } = params
  const spellings = LOWERCASE_UNIT_SPELLINGS[requestedUnit]
  if (!spellings) return undefined

  const lowercaseUnit = unit.toLowerCase()
  for (const spelling of spellings) {
    if (!lowercaseUnit.endsWith(spelling)) continue
    const prefix = unit.slice(0, unit.length - spelling.length)
    if (spelling === "" && prefix.toLowerCase() !== "meg") continue
    const prefixMultiplier = getRequestedPrefixMultiplier(prefix)
    if (prefixMultiplier !== undefined) return prefixMultiplier
  }
  return undefined
}
