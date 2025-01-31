const SI_PREFIXES = [
  { value: 1e12, symbol: "T" },
  { value: 1e9, symbol: "G" },
  { value: 1e6, symbol: "M" },
  { value: 1e3, symbol: "k" },
  { value: 1, symbol: "" },
  { value: 1e-3, symbol: "m" },
  { value: 1e-6, symbol: "µ" },
  { value: 1e-9, symbol: "n" },
  { value: 1e-12, symbol: "p" },
]

export function formatSiUnit(value?: number | null): string {
  if (value == null) return ""
  if (value === 0) return "0"

  const absValue = Math.abs(value)
  
  const prefix = SI_PREFIXES.find((p) => {
    const scaled = absValue / p.value
    return scaled >= 1 && scaled < 1000
  }) || SI_PREFIXES[SI_PREFIXES.length - 1]

  const scaled = value / prefix.value

  let formatted = scaled.toPrecision(3)
  
  // Only remove trailing zeros if there's a non-zero digit after the decimal
  if (formatted.includes('.') && !/\.0+$/.test(formatted)) {
    formatted = formatted.replace(/0+$/, '')
  }
  
  // Remove any pure ".0" or ".00" suffixes
  formatted = formatted.replace(/\.0+$/, '')

  return `${formatted}${prefix.symbol}`
}