// Component values often put the prefix where the decimal point would be.
// Keep this limited to a complete value so ordinary unit strings are unchanged.
const EMBEDDED_DECIMAL_PATTERN =
  /^([+-]?\d+)([fpnumkKMGTµμRr])(\d+)(Ω|Hz|H|F|V|A)?$/u

export function parseEmbeddedDecimalSiUnit(value: string): string | undefined {
  const match = value.match(EMBEDDED_DECIMAL_PATTERN)
  if (!match) return undefined

  const [, whole, marker, fraction, unit = ""] = match
  if (marker === "R" || marker === "r") {
    if (unit && unit !== "Ω") return undefined
    return `${whole}.${fraction}Ω`
  }
  return `${whole}.${fraction}${marker}${unit}`
}
